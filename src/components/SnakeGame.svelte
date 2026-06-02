<script>
  import { onMount, onDestroy } from 'svelte';
  
  let canvas;
  let ctx;
  let gameLoop;
  let snake = [];
  let food = {};
  let direction = 'right';
  let nextDirection = 'right';
  let inputQueue = [];
  const maxQueueSize = 3;
  let visualSnake = []; // For smooth interpolation
  let lastDirection = 'right'; // Track direction changes
  let score = 0;
  let gameOver = false;
  let gameStarted = false;
  const gridSize = 20;
  const tileCount = 12;
  let lastUpdateTime = 0;
  let updateInterval = 150;
  const maxSpeedInterval = 50;
  const totalTiles = tileCount * tileCount;
  const speedLimitTiles = Math.floor(totalTiles * 0.6);
  let isMobile = false;
  let baseInterval = 150;
  const maxPossibleScore = (tileCount * tileCount - 3) * 10; // 144 tiles - 3 initial segments = 141 food * 10 points
  let maxScore = maxPossibleScore;
  let audioContext;
  let moveCounter = 0;
  
  onMount(() => {
    // Initialize audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Detect mobile/tablet
    isMobile = window.innerWidth < 1024 || 'ontouchstart' in window;
    if (isMobile) {
      baseInterval = 150 * 1.6;
    }
    
    if (canvas) {
      ctx = canvas.getContext('2d');
      canvas.width = gridSize * tileCount;
      canvas.height = gridSize * tileCount;
      resetGame();
      draw();
    }
    
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      if (gameLoop) cancelAnimationFrame(gameLoop);
      if (audioContext) audioContext.close();
    };
  });
  
  function resetGame() {
    snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ];
    direction = 'right';
    nextDirection = 'right';
    lastDirection = 'right';
    inputQueue = [];
    score = 0;
    gameOver = false;
    updateInterval = baseInterval;
    moveCounter = 0;
    // Initialize visual snake with same positions
    visualSnake = snake.map(seg => ({ x: seg.x, y: seg.y }));
    spawnFood();
  }
  
  function playEatSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
  
  function playGameOverSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }
  
  function playMoveSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Randomize between two subtle pitches
    const pitch = Math.random() > 0.5 ? 180 : 220;
    oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
    
    // Very quiet and subtle
    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.03);
  }
  
  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        spawnFood();
        return;
      }
    }
  }
  
  function startGame() {
    // Resume audio context if suspended (browsers require user interaction)
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    resetGame();
    gameStarted = true;
    gameOver = false;
    lastUpdateTime = 0;
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(gameLoopFn);
  }
  
  function gameLoopFn(timestamp) {
    if (!gameStarted || gameOver) return;
    
    if (timestamp - lastUpdateTime >= updateInterval) {
      update();
      lastUpdateTime = timestamp;
    }
    
    // Interpolate visual positions for smooth movement
    interpolate();
    draw();
    
    gameLoop = requestAnimationFrame(gameLoopFn);
  }
  
  function interpolate() {
    const progress = Math.min((performance.now() - lastUpdateTime) / updateInterval, 1);
    
    // Sync visual snake length with logical snake
    while (visualSnake.length < snake.length) {
      const lastSeg = visualSnake[visualSnake.length - 1] || snake[snake.length - 1];
      visualSnake.push({ x: lastSeg.x, y: lastSeg.y });
    }
    while (visualSnake.length > snake.length) {
      visualSnake.pop();
    }
    
    // Interpolate each segment towards its target position
    for (let i = 0; i < snake.length; i++) {
      const target = snake[i];
      const current = visualSnake[i];
      
      if (current) {
        // Check for wrapping - if distance is large, snap instantly
        const dx = Math.abs(target.x - current.x);
        const dy = Math.abs(target.y - current.y);
        
        if (dx > tileCount / 2 || dy > tileCount / 2) {
          // Wrapping detected - snap to target
          current.x = target.x;
          current.y = target.y;
        } else {
          // Use linear interpolation based on progress for smoother movement
          const lerpFactor = 0.5; // Higher factor = smoother, less bouncy
          current.x += (target.x - current.x) * lerpFactor;
          current.y += (target.y - current.y) * lerpFactor;
        }
      }
    }
  }
  
  function update() {
    if (gameOver) return;
    
    // Get next direction from queue
    if (inputQueue.length > 0) {
      direction = inputQueue.shift();
    }
    
    // Track direction changes
    if (direction !== lastDirection) {
      lastDirection = direction;
      // Snap visual head to target when turning
      if (visualSnake[0]) {
        visualSnake[0].x = snake[0].x;
        visualSnake[0].y = snake[0].y;
      }
    }
    
    const head = { ...snake[0] };
    
    switch (direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    
    // Wrap around walls
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
    
    // Check self collision
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        gameOver = true;
        cancelAnimationFrame(gameLoop);
        playGameOverSound();
        return;
      }
    }
    
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      playEatSound();
      spawnFood();
      // Increase speed until 3/5th of total tiles
      if (snake.length < speedLimitTiles) {
        const progress = snake.length / speedLimitTiles;
        updateInterval = baseInterval - (progress * (baseInterval - maxSpeedInterval));
      }
    } else {
      snake.pop();
      moveCounter++;
      if (moveCounter >= 3) {
        playMoveSound();
        moveCounter = 0;
      }
    }
  }
  
  function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(canvas.width, i * gridSize);
      ctx.stroke();
    }
    
    // Draw snake using interpolated positions
    visualSnake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4CAF50' : '#81C784';
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
    });
    
    // Draw food
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize
    );
  }
  
  function handleKeydown(event) {
    if (!gameStarted) return;
    
    let newDir = null;
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        newDir = 'up';
        event.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        newDir = 'down';
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        newDir = 'left';
        event.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        newDir = 'right';
        event.preventDefault();
        break;
    }
    
    if (newDir) {
      addToQueue(newDir);
    }
  }
  
  function handleDirection(dir) {
    if (!gameStarted) return;
    addToQueue(dir);
  }
  
  function addToQueue(newDir) {
    // Prevent 180-degree turns and same direction
    const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : direction;
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    
    if (newDir !== lastDir && newDir !== opposites[lastDir]) {
      if (inputQueue.length < maxQueueSize) {
        inputQueue.push(newDir);
      }
    }
  }
</script>

<div class="snake-container">
  <h2>Snake Game</h2>
  <div class="instructions-container">
    <p class="instructions">
      <span class="key-icons">
        <svg width="60" height="40" viewBox="0 0 60 40" class="wasd-icon">
          <rect x="23" y="5" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="31" y="17" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">W</text>
          <rect x="5" y="23" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="13" y="35" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">A</text>
          <rect x="23" y="23" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="31" y="35" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">S</text>
          <rect x="41" y="23" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="49" y="35" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">D</text>
        </svg>
        or
        <svg width="60" height="40" viewBox="0 0 60 40" class="arrow-icon">
          <rect x="23" y="5" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="31" y="17" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">↑</text>
          <rect x="5" y="23" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="13" y="35" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">←</text>
          <rect x="23" y="23" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="31" y="35" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">↓</text>
          <rect x="41" y="23" width="16" height="16" rx="2" fill="#333" stroke="#555" stroke-width="1"/>
          <text x="49" y="35" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">→</text>
        </svg>
      </span>
      or arrow buttons to control the snake. Eat food to grow!
    </p>
  </div>
  
  <div class="game-area">
    <div class="score">Score: {score}/{maxScore}</div>
    <canvas bind:this={canvas} class="game-canvas"></canvas>
    
    {#if !gameStarted}
      <button class="start-btn" on:click={startGame}>Start Game</button>
    {:else if gameOver}
      <div class="game-over">
        <p>Game Over!</p>
        <p>Final Score: {score}</p>
        <button class="restart-btn" on:click={startGame}>Play Again</button>
      </div>
    {/if}
    
    <div class="arrow-buttons">
      <button class="arrow-btn up" on:click={() => handleDirection('up')}>↑</button>
      <button class="arrow-btn left" on:click={() => handleDirection('left')}>←</button>
      <button class="arrow-btn right" on:click={() => handleDirection('right')}>→</button>
      <button class="arrow-btn down" on:click={() => handleDirection('down')}>↓</button>
    </div>
  </div>
</div>

<style>
  .snake-container {
    background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
    border-radius: 20px;
    padding: 2rem;
    max-width: 100%;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    color: white;
    overflow: hidden;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    text-align: center;
  }

  .instructions {
    text-align: center;
    margin-bottom: 0;
    opacity: 0.9;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .instructions-container {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .key-icons {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .wasd-icon,
  .arrow-icon {
    vertical-align: middle;
  }

  .game-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .score {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .game-canvas {
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: #1a1a1a;
    max-width: 100%;
    height: auto;
    width: 240px;
    height: 240px;
  }

  .game-over {
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 10px;
  }

  .game-over p {
    margin: 0.5rem 0;
  }

  button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s ease, color 0.3s ease;
    background: white;
    color: #2E7D32;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 1024px) {
    button:hover {
      background: #FFB74D;
      color: black;
      text-shadow: none;
    }
  }

  .restart-btn {
    margin-top: 0.5rem;
  }

  .arrow-buttons {
    display: grid;
    grid-template-columns: 50px 50px 50px;
    grid-template-rows: 50px 50px;
    gap: 2px;
    margin-top: 1rem;
    justify-content: center;
  }

  .arrow-btn {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #333;
    color: white;
    border: 1px solid #555;
    border-radius: 2px;
  }

  .arrow-btn.up {
    grid-column: 2;
    grid-row: 1;
  }

  .arrow-btn.left {
    grid-column: 1;
    grid-row: 2;
  }

  .arrow-btn.right {
    grid-column: 3;
    grid-row: 2;
  }

  .arrow-btn.down {
    grid-column: 2;
    grid-row: 2;
  }

  .arrow-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .arrow-btn:active {
    transform: scale(0.95);
  }
</style>
