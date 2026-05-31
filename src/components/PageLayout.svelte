<script>
  let { title, description } = $props();
</script>

<main class="main-content">
  <div class="content-bar">
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
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
    text-align: center;
    gap: 1rem;
    min-height: calc(100vh - 200px);
  }

  .content-bar {
    background-color: var(--color-primary-bg);
    border-radius: var(--border-radius-card);
    padding: 0;
    box-shadow: var(--shadow-card);
  }

  .main-content h1 {
    font-size: 2.5rem;
    font-family: var(--font-family-base);
    font-style: italic;
    padding: 0.5rem 1rem;
  }

  .main-content p {
    font-size: 1.2rem;
    color: var(--color-text-muted);
    padding: 0 1rem 0.5rem 1rem;
  }

  @media (max-width: 768px) {
    .main-content h1 {
      font-size: 1.5rem;
      padding: 0.3rem 0.8rem;
    }

    .main-content p {
      font-size: 1rem;
      padding: 0 0.8rem 0.3rem 0.8rem;
    }
  }
</style>
