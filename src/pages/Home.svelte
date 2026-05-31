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
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    height: calc(100vh - 70px);
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
 
  @media (min-width: 769px) {
    .circles-container {
      gap: 1rem;
      margin: 0 auto;
      width: 100%;
      height: calc(100vh - 70px);
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      position: relative;
    }
 
    .circle {
      flex-shrink: 0;
      width: 15vw;
      height: 15vw;
    }
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
    .main-content {
      height: calc(100vh - 60px);
    }
 
    .circles-container {
      width: 90%;
      gap: 2rem;
    }
 
    .circle {
      width: 45vw;
      height: 45vw;
      max-width: 250px;
      max-height: 250px;
    }
 
    .circle-row {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
  }
</style>
