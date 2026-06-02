<script>
  import GitHubLanguageChart from '../components/GitHubLanguageChart.svelte';
  import NumberGuessingGame from '../components/NumberGuessingGame.svelte';
</script>

<main class="main-content">
  <NumberGuessingGame />
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
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .main-content {
      flex-direction: row;
      align-items: flex-start;
    }
  }
</style>
