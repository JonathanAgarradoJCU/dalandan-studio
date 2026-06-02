<script>
  import GitHubLanguageChart from '../components/GitHubLanguageChart.svelte';
  import NumberGuessingGame from '../components/NumberGuessingGame.svelte';
  import SnakeGame from '../components/SnakeGame.svelte';
</script>

<main class="main-content">
  <div class="games-container">
    <NumberGuessingGame />
    <SnakeGame />
  </div>
  <GitHubLanguageChart />
</main>

<style>
  .main-content {
    flex: 1;
    padding: 3rem 2rem;
    max-width: var(--content-max-width);
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 200px);
    gap: 1rem;
  }

  .games-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    align-items: center;
  }

  @media (min-width: 900px) {
    .main-content {
      flex-direction: row;
      align-items: flex-start;
    }

    .games-container {
      flex: 1;
      min-width: 300px;
    }

    .main-content > :last-child {
      flex: 1;
      min-width: 300px;
    }
  }
</style>
