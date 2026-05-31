<main class="main-content">
  <div class="circles-container">
    <div class="circle"></div>
    <div class="circle-row">
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
  </div>
</main>

<style>
  .main-content {
    max-width: var(--content-max-width);
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - var(--nav-height));
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 10;
  }

  .circles-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5rem;
  }

  .circle {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: var(--color-primary-bg);
    box-shadow: var(--shadow-card);
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .circle:hover {
    transform: scale(1.05);
  }

  .circle-row {
    display: flex;
    gap: 8rem;
  }

  @media (min-width: 769px) {
    .circles-container {
      gap: 1rem;
    }

    .circle {
      width: min(24vw, 34vh);
      height: min(24vw, 34vh);
    }

    .circle-row {
      gap: 12rem;
    }
  }

  @media (min-width: 457px) and (max-width: 768px) {
    .main-content {
      min-height: calc(100vh - 60px);
    }

    .circles-container {
      width: 90%;
      height: 100%;
      justify-content: center;
      gap: 2rem;
    }

    .circle {
      width: min(35vw, 28vh);
      height: min(35vw, 28vh);
      max-width: 200px;
      max-height: 200px;
    }

    .circle-row {
      gap: 5rem;
    }
  }

  @media (max-width: 456px) {
    .main-content {
      min-height: calc(100vh - 60px);
      align-items: flex-start;
      padding-top: var(--nav-height);
    }

    .circles-container {
      width: 80%;
      justify-content: flex-start;
      gap: 1.5rem;
    }

    .circle {
      width: clamp(150px, 52vw, 220px);
      height: clamp(150px, 52vw, 220px);
      flex-shrink: 0;
    }

    .circle-row {
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
  }
</style>
