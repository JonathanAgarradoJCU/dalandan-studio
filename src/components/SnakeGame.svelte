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
  let playerWon = false;
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
  let foodPulse = 0;
  
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
    playerWon = false;
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
    
    // Hiss-like sound using sawtooth wave with 7 randomized pitches
    oscillator.type = 'sawtooth';
    const pitches = [150, 180, 220, 260, 300, 340, 380];
    const pitch = pitches[Math.floor(Math.random() * pitches.length)];
    oscillator.frequency.setValueAtTime(pitch, audioContext.currentTime);
    
    // Increased volume and duration for better audibility
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }
  
  function playCoinSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Coin slot metallic sound - lower pitch with quick decay
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  }

  function playLeaveSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Leaving sound - descending tone
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  function playClickSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Keyboard type sound - short click
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.015, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
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
    
    playCoinSound();
    resetGame();
    gameStarted = true;
    gameOver = false;
    lastUpdateTime = 0;
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(gameLoopFn);
  }

  function endGame() {
    playLeaveSound();
    gameStarted = false;
    gameOver = false;
    if (gameLoop) cancelAnimationFrame(gameLoop);
    resetGame();
  }
  
  function gameLoopFn(timestamp) {
    if (!gameStarted || gameOver) return;
    
    if (timestamp - lastUpdateTime >= updateInterval) {
      update();
      lastUpdateTime = timestamp;
    }
    
    // Update food pulse animation
    foodPulse = (foodPulse + 0.06) % (Math.PI * 2);
    
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
    
    // Check win condition - snake fills entire board
    if (snake.length === totalTiles) {
      gameOver = true;
      playerWon = true;
      cancelAnimationFrame(gameLoop);
      playEatSound();
      return;
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
      if (moveCounter >= 5) {
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
      // Head is blue, body follows pattern: Orange, Orange, Macaroni, Blue repeating
      if (index === 0) {
        ctx.fillStyle = '#2196F3'; // Blue head
      } else {
        const patternIndex = (index - 1) % 4;
        if (patternIndex === 0 || patternIndex === 1) {
          ctx.fillStyle = '#FF9800'; // Orange
        } else if (patternIndex === 2) {
          ctx.fillStyle = '#FFE082'; // Macaroni (slight orange tint)
        } else {
          ctx.fillStyle = '#2196F3'; // Blue
        }
      }
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
      
      // Draw outline on sides not connected to another segment
      ctx.strokeStyle = index === 0 ? '#2196F3' : '#FF9800';
      ctx.lineWidth = 1;
      
      // Check each direction for adjacent segments
      const hasUp = snake.some(s => s.x === segment.x && s.y === segment.y - 1);
      const hasDown = snake.some(s => s.x === segment.x && s.y === segment.y + 1);
      const hasLeft = snake.some(s => s.x === segment.x - 1 && s.y === segment.y);
      const hasRight = snake.some(s => s.x === segment.x + 1 && s.y === segment.y);
      
      const x = segment.x * gridSize;
      const y = segment.y * gridSize;
      
      if (!hasUp) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + gridSize, y);
        ctx.stroke();
      }
      if (!hasDown) {
        ctx.beginPath();
        ctx.moveTo(x, y + gridSize);
        ctx.lineTo(x + gridSize, y + gridSize);
        ctx.stroke();
      }
      if (!hasLeft) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + gridSize);
        ctx.stroke();
      }
      if (!hasRight) {
        ctx.beginPath();
        ctx.moveTo(x + gridSize, y);
        ctx.lineTo(x + gridSize, y + gridSize);
        ctx.stroke();
      }
    });
    
    // Draw food with pulsing color
    const pulseValue = (Math.sin(foodPulse) + 1) / 2; // 0 to 1
    const red = Math.floor(255 * (1 - pulseValue * 0.2)); // 255 to 204
    const green = Math.floor(87 * (1 - pulseValue * 0.3)); // 87 to 61
    const blue = Math.floor(34 * (1 - pulseValue * 0.3)); // 34 to 24
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
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
      or arrow buttons below to control the snake. Eat <span class="food-cube"></span> to grow!
    </p>
  </div>
  
  <div class="game-area">
    <div class="score">Score: {score} / {maxScore}</div>
    <div class="canvas-wrapper">
      <canvas bind:this={canvas} class="game-canvas"></canvas>
      {#if !gameStarted}
        <button class="start-btn" on:click={startGame}>Start Game</button>
      {/if}
      {#if gameOver}
        <div class="game-over">
          <p>{playerWon ? 'Congratulations, you won!' : 'Game Over!'}</p>
          <p>Final Score: {score}</p>
          <button class="restart-btn" on:click={startGame}>Play Again</button>
        </div>
      {/if}
    </div>
    
    <div class="arrow-buttons">
      <button class="arrow-btn up" on:click={() => { playClickSound(); handleDirection('up'); }}>↑</button>
      <button class="arrow-btn left" on:click={() => { playClickSound(); handleDirection('left'); }}>←</button>
      <button class="arrow-btn right" on:click={() => { playClickSound(); handleDirection('right'); }}>→</button>
      <button class="arrow-btn down" on:click={() => { playClickSound(); handleDirection('down'); }}>↓</button>
    </div>
  </div>
  
  {#if gameStarted}
    <button class="end-game-btn" on:click={endGame}>End Game</button>
  {/if}
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
    position: relative;
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

  .food-cube {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: #FF5722;
    border: 1px solid #333;
    border-radius: 2px;
    vertical-align: middle;
    margin: 0 2px;
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

  .canvas-wrapper {
    position: relative;
    display: inline-block;
  }

  .start-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .start-btn:hover {
    transform: translate(-50%, -50%) translateY(-2px);
  }

  .game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background: rgba(27, 94, 32, 0.9);
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
    gap: 4px;
    margin-top: 1rem;
    justify-content: center;
  }

  @media (max-width: 1023px) {
    .arrow-buttons {
      gap: 16px;
      grid-template-columns: 60px 60px 60px;
      grid-template-rows: 60px 60px;
    }

    .arrow-btn {
      width: 60px;
      height: 60px;
    }
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

  .end-game-btn {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    margin: 1rem 0 0 auto;
  }

  .end-game-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .arrow-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .arrow-btn:active {
    transform: scale(0.95);
  }
</style>
