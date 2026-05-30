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
    flex: 1;
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 60px - 60px);
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
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background-color: rgba(233, 185, 112, 0.9);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
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

  @media (max-width: 768px) {
    .circles-container {
      width: 70%;
      margin: 0 auto;
    }

    .circle {
      width: 35vw;
      height: 35vw;
      max-width: 200px;
      max-height: 200px;
    }

    .circle-row {
      display: flex;
      flex-direction: column;
      gap: 5rem;
    }
  }
</style>
