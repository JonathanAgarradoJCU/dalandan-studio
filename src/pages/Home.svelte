<script>
  import { circlesMode, circlesAnimating } from '../stores/circlesStore.js';
  import { onMount } from 'svelte';
  let isShrinking = $state(false);
  let circlesVisible = $state(false);

  function handleCircleClick(route) {
    isShrinking = true;
    circlesAnimating.set(true);
    setTimeout(() => {
      circlesMode.set('nav');
      window.location.hash = route;
    }, 350);
  }

  onMount(() => {
    setTimeout(() => {
      circlesVisible = true;
    }, 100);
  });
</script>

<main class="main-content">
  <div class="circles-container" class:shrinking={isShrinking} class:visible={circlesVisible}>
    <button class="circle circle-red" inert={!circlesVisible} onclick={() => handleCircleClick('#/art')} aria-label="Art">
      <span class="circle-text">Art</span>
    </button>
    <div class="circle-row">
      <button class="circle circle-green" inert={!circlesVisible} onclick={() => handleCircleClick('#/music')} aria-label="Music">
        <span class="circle-text">Music</span>
      </button>
      <button class="circle circle-blue" inert={!circlesVisible} onclick={() => handleCircleClick('#/it-portfolio')} aria-label="IT Portfolio">
        <span class="circle-text">IT Portfolio</span>
      </button>
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
    transition: transform 0.4s ease-in-out, opacity 0.4s ease;
    opacity: 0;
  }

  .circles-container.visible {
    opacity: 1;
  }

  .circles-container.shrinking {
    transform: scale(0.3);
    opacity: 0;
    transition: transform 0.35s ease-in-out, opacity 0.35s ease;
  }

  .circle {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: var(--shadow-card);
    cursor: pointer;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle-text {
    color: #ffffff;
    font-size: 1.5rem;
    font-weight: 600;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .circle:hover {
    transform: scale(1.05);
  }

  .circle-red {
    background-color: rgba(255, 0, 0, 0.5);
  }

  .circle-green {
    background-color: rgba(29, 185, 84, 0.5);
  }

  .circle-blue {
    background-color: rgba(0, 0, 255, 0.5);
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

  @media (min-width: 457px) and (max-width: 870px) {
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

  @media (min-width: 333px) and (max-width: 456px) {
    .main-content {
      min-height: calc(100vh - 60px);
      align-items: center;
      padding-top: 0;
      padding-bottom: 2rem;
    }

    .circles-container {
      width: 90%;
      justify-content: center;
      gap: 1rem;
      max-height: none;
    }

    .circle {
      width: clamp(100px, 35vw, 140px);
      height: clamp(100px, 35vw, 140px);
      flex-shrink: 0;
    }

    .circle-row {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .circle-text {
      font-size: 1rem;
    }
  }

  @media (max-width: 332px) {
    .main-content {
      min-height: calc(100vh - 60px);
      align-items: center;
      padding-top: 0;
      padding-bottom: 2rem;
    }

    .circles-container {
      width: 90%;
      justify-content: center;
      gap: 1rem;
    }

    .circle {
      width: clamp(90px, 30vw, 130px);
      height: clamp(90px, 30vw, 130px);
      flex-shrink: 0;
    }

    .circle-row {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .circle-text {
      font-size: 0.9rem;
    }
  }
</style>
