<script>
  let secretNumber = null;
  let guess = $state('');
  let message = $state('');
  let attempts = $state(0);
  let maxAttempts = $state(10);
  let history = $state([]); // Array of { number, wasLow }
  let guessAttempts = new Map(); // Track which attempt each guess was made on
  let gameActive = $state(false);
  let loading = $state(false);
  let winningGuess = $state(null);
  let mostRecentGuess = $state(null);
  let guessResult = $state(null);
  let hint = $state(null);
  let audioContext;

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

  function playLowSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Decreasing pitch for low guess
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }

  function playHighSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Increasing pitch for high guess
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }

  function playLoseSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Bomb blast - low frequency with quick decay
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
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

  function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function startGame() {
    // Initialize audio context on first interaction
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume audio context if suspended (browsers require user interaction)
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    playCoinSound();
    secretNumber = Math.floor(Math.random() * 500) + 1;
    maxAttempts = 10;
    message = 'New game started! Guess a number between 1 and 500.';
    attempts = 0;
    history = [];
    guessAttempts.clear();
    gameActive = true;
    guess = '';
    hint = null;
    guessResult = null;
    winningGuess = null;
    mostRecentGuess = null;
  }

  function endGame() {
    playLeaveSound();
    gameActive = false;
    message = '';
    hint = null;
    guessResult = null;
    guess = '';
  }

  function submitGuess() {
    if (!guess || !gameActive) return;
    
    const guessNum = parseInt(guess);
    if (guessNum < 1 || guessNum > 500) {
      message = 'Please enter a number between 1 and 500.';
      return;
    }
    
    if (history.some(h => h.number === guessNum)) {
      const attemptNum = guessAttempts.get(guessNum);
      if (guessNum < secretNumber) {
        guessResult = 'too_low';
        hint = `Your ${getOrdinal(attemptNum)} guess was low!`;
      } else {
        guessResult = 'too_high';
        hint = `Your ${getOrdinal(attemptNum)} guess was high!`;
      }
      message = "You've already picked this number. Pick another one.";
      guess = '';
      return;
    }
    
    attempts++;
    history.push({ number: guessNum, wasLow: guessNum < secretNumber });
    guessAttempts.set(guessNum, attempts);
    
    if (guessNum === secretNumber) {
      guessResult = 'correct';
      message = `Congratulations! You guessed the number in ${attempts} attempts!`;
      winningGuess = guessNum;
      mostRecentGuess = guessNum;
      gameActive = false;
      guess = '';
      hint = null;
    } else if (attempts >= maxAttempts) {
      guessResult = 'lost';
      message = `Game over! The number was <span class="highlight-number">${secretNumber}</span>.`;
      hint = `Your final guess was ${guessNum < secretNumber ? 'low' : 'high'}!`;
      mostRecentGuess = guessNum;
      gameActive = false;
      guess = '';
      playLoseSound();
    } else if (guessNum < secretNumber) {
      guessResult = 'too_low';
      message = 'Low! Try again.';
      hint = `Your ${getOrdinal(attempts)} guess was low!`;
      mostRecentGuess = guessNum;
      guess = '';
      playLowSound();
    } else {
      guessResult = 'too_high';
      message = 'High! Try again.';
      hint = `Your ${getOrdinal(attempts)} guess was high!`;
      mostRecentGuess = guessNum;
      guess = '';
      playHighSound();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && gameActive) {
      submitGuess();
    }
  }
</script>

<div class="game-container" class:winner={guessResult === 'correct'}>
  <h2>Number Guessing Game</h2>
  <div class="instructions-container">
    <p class="instructions">Guess a number between 1 and 500. You have {maxAttempts} attempts!</p>
  </div>
  
  <div class="game-status">
    {#if gameActive || message}
      <div class="message {gameActive ? 'active' : 'inactive'} {guessResult === 'too_low' ? 'tooLow' : ''} {guessResult === 'too_high' ? 'tooHigh' : ''} {guessResult === 'lost' ? 'lost' : ''}">
        {@html message}
        {#if hint}
          <div class="hint">{hint}</div>
        {/if}
      </div>
    {/if}
    
    {#if gameActive}
      <div class="input-section">
        <input 
          type="number" 
          bind:value={guess} 
          min="1" 
          max="500" 
          placeholder="Enter your guess (1-500)"
          on:keydown={handleKeydown}
          disabled={loading}
        />
        <button 
          on:click={submitGuess} 
          disabled={loading || !guess}
          class="guess-btn"
        >
          {loading ? '...' : 'Guess!'}
        </button>
      </div>
    {:else}
      <button 
        on:click={startGame} 
        disabled={loading}
        class="start-btn"
      >
        {loading ? '...' : 'Start Game'}
      </button>
    {/if}
  </div>
  
  {#if history.length > 0}
    <div class="history">
      <h3>Guess History (Lowest to Highest)</h3>
      <div class="history-list">
        {#each [...history].sort((a, b) => a.number - b.number) as h}
          <span class="history-item" class:winner={h.number === winningGuess} class:recent={h.number === mostRecentGuess && h.number !== winningGuess} class:low={h.wasLow && h.number !== winningGuess} class:high={!h.wasLow && h.number !== winningGuess}>{h.number}</span>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="attempts">
    <p>Attempts: {attempts} / {maxAttempts}</p>
  </div>
  
  {#if gameActive}
    <button class="end-game-btn" on:click={endGame}>End Game</button>
  {/if}
</div>

<style>
  .game-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 2rem;
    max-width: 100%;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    color: white;
    transition: background 0.3s ease;
    position: relative;
  }

  .game-container.winner {
    background: linear-gradient(135deg, #8BC34A 0%, #7cb342 100%);
  }

  .game-container.winner .message.active {
    background: rgba(0, 100, 0, 0.3);
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
  }

  .instructions-container {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .game-status {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .message {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .message.active {
    background: rgba(255, 255, 255, 0.15);
  }

  .message.inactive {
    background: rgba(255, 255, 255, 0.05);
  }

  .message.tooLow {
    background: #339ddae6 !important;
    color: white;
    text-shadow: none;
  }

  .message.tooHigh {
    background: #da3333e6 !important;
    color: white;
    text-shadow: none;
  }

  .hint {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  .highlight-number {
    font-weight: bold;
    color: #FFB74D;
    text-shadow: 0 0 10px rgba(255, 183, 77, 0.5);
  }

  :global(.highlight-number) {
    font-weight: bold;
    color: #FFB74D;
    text-shadow: 0 0 10px rgba(255, 183, 77, 0.5);
  }

  .message.lost {
    background: #1a1a1a !important;
    color: white;
    text-shadow: none;
  }

  .input-section {
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
    color: #333;
  }

  input:focus {
    outline: 2px solid #fff;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, background-color 0.3s ease, color 0.3s ease;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 1024px) {
    button:hover:not(:disabled) {
      background: #FFB74D;
      color: black;
      text-shadow: none;
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .guess-btn {
    background: #fff;
    color: #667eea;
  }

  .start-btn {
    width: 100%;
    background: #fff;
    color: #667eea;
    padding: 0.75rem 1.5rem;
  }

  @media (min-width: 1024px) {
    .start-btn {
      width: auto;
      padding: 0.75rem 2rem;
    }
  }

  .history {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .history h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .history-item {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.9rem;
  }

  .history-item.winner {
    background: linear-gradient(135deg, #7cb342 0%, #689f38 100%);
    color: white;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(139, 195, 74, 0.5);
    border: 2px solid white;
    animation: jiggle 1s ease-in-out infinite;
    transform-origin: center;
  }

  .history-item.recent {
    background: white;
    color: #667eea;
    font-weight: bold;
    text-shadow: none;
    animation: jiggle 1s ease-in-out infinite;
    transform-origin: center;
    border: 2px solid white;
  }

  @keyframes jiggle {
    0%, 100% { transform: rotate(-5deg) scale(1); }
    25% { transform: rotate(5deg) scale(1.05); }
    50% { transform: rotate(-5deg) scale(1); }
    75% { transform: rotate(5deg) scale(1.05); }
  }

  .history-item.low {
    background: #339ddae6;
    color: white;
    text-shadow: none;
  }

  .history-item.high {
    background: #da3333e6;
    color: white;
    text-shadow: none;
  }

  .attempts {
    text-align: center;
    font-weight: 600;
    opacity: 0.9;
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
</style>
