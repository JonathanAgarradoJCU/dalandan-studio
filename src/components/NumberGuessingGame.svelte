<script>
  let gameId = null;
  let guess = '';
  let message = 'Click "Start Game" to begin!';
  let attempts = 0;
  let maxAttempts = 10;
  let history = [];
  let gameActive = false;
  let loading = false;
  let winningGuess = null;
  let mostRecentGuess = null;
  let guessResult = null;
  let hint = null;

  async function startGame() {
    loading = true;
    try {
      const response = await fetch('http://localhost:5000/api/game/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      gameId = data.game_id;
      maxAttempts = data.max_attempts;
      message = data.message;
      attempts = 0;
      history = [];
      gameActive = true;
      guess = '';
      hint = null;
      guessResult = null;
    } catch (error) {
      message = 'Error connecting to game server. Make sure the Python backend is running.';
    }
    loading = false;
  }

  async function submitGuess() {
    if (!guess || !gameActive) return;
    
    const guessNum = parseInt(guess);
    if (guessNum < 1 || guessNum > 500) {
      message = 'Please enter a number between 1 and 500.';
      return;
    }
    
    loading = true;
    try {
      const response = await fetch('http://localhost:5000/api/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id: gameId, guess: guessNum })
      });
      const data = await response.json();
      message = data.message;
      attempts = data.attempts;
      history = data.history;
      winningGuess = data.winning_guess;
      guessResult = data.result;
      hint = data.hint || null;
      
      if (data.result === 'correct' || data.result === 'lost') {
        gameActive = false;
        guess = '';
      } else if (data.message.includes("already picked")) {
        // Duplicate guess - don't update mostRecentGuess
        guess = '';
      } else {
        mostRecentGuess = guessNum;
        guess = '';
      }
    } catch (error) {
      message = 'Error submitting guess. Check if the Python backend is running.';
    }
    loading = false;
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && gameActive) {
      submitGuess();
    }
  }
</script>

<div class="game-container">
  <h2>Number Guessing Game</h2>
  <p class="instructions">Guess a number between 1 and 500. You have {maxAttempts} attempts!</p>
  
  <div class="game-status">
    <div class="message {gameActive ? 'active' : 'inactive'} {guessResult === 'too_low' ? 'tooLow' : ''} {guessResult === 'too_high' ? 'tooHigh' : ''} {guessResult === 'lost' ? 'lost' : ''}">
      {message}
      {#if hint}
        <div class="hint">{hint}</div>
      {/if}
    </div>
    
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
        {#each [...history].sort((a, b) => a - b) as h}
          <span class="history-item" class:winner={h === winningGuess} class:recent={h === mostRecentGuess && h !== winningGuess}>{h}</span>
        {/each}
      </div>
    </div>
  {/if}
  
  <div class="attempts">
    <p>Attempts: {attempts} / {maxAttempts}</p>
  </div>
</div>

<style>
  .game-container {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    color: white;
  }

  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    text-align: center;
  }

  .instructions {
    text-align: center;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .game-status {
    margin-bottom: 1.5rem;
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
    transition: transform 0.2s, box-shadow 0.2s;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
    background: #8BC34A;
    color: white;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(139, 195, 74, 0.5);
  }

  .history-item.recent {
    background: white;
    color: #667eea;
    font-weight: bold;
    text-shadow: none;
  }

  .attempts {
    text-align: center;
    font-weight: 600;
    opacity: 0.9;
  }
</style>
