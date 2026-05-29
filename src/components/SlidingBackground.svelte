<script>
  import { onMount } from 'svelte';

  let laneCount = $state(0);
  const tileSize = 150;

  onMount(() => {
    laneCount = Math.ceil(window.innerWidth / tileSize) + 1;

    function handleResize() {
      laneCount = Math.ceil(window.innerWidth / tileSize) + 1;
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
</script>

<div class="sliding-container">
  {#each Array(laneCount) as _, i}
    <div
      class="lane"
      class:lane-down={i % 2 === 0}
      class:lane-up={i % 2 !== 0}
    ></div>
  {/each}
</div>

<style>
  .sliding-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
    display: flex;
  }

  .lane {
    width: 150px;
    flex-shrink: 0;
    height: calc(100vh + 150px);
    background-image: url('../assets/cross-pattern.png');
    background-repeat: repeat;
    background-size: 150px 150px;
    opacity: 0.3;
  }

  .lane-down {
    animation: slide-down 10s linear infinite;
  }

  .lane-up {
    animation: slide-up 10s linear infinite;
  }

  @keyframes slide-down {
    from {
      transform: translateY(-150px);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slide-up {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-150px);
    }
  }
</style>
