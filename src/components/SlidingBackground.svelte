<script>
  import { onMount } from 'svelte';
  import crossPattern from '../assets/cross-pattern.png';

  let laneCount = $state(0);
  let tilesPerLane = $state(0);
  const tileSize = 150;
  const gap = 30;
  const step = tileSize + gap;

  function recalc() {
    laneCount = Math.ceil(window.innerWidth / tileSize) + 1;
    tilesPerLane = Math.ceil((window.innerHeight + step) / step) + 1;
  }

  onMount(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  });
</script>

<div class="sliding-container">
  {#each Array(laneCount) as _, i}
    <div
      class="lane"
      class:lane-down={i % 2 === 0}
      class:lane-up={i % 2 !== 0}
    >
      {#each Array(tilesPerLane) as _}
        <img src={crossPattern} alt="" class="tile" />
      {/each}
    </div>
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
    z-index: -1;
    pointer-events: none;
    display: flex;
    opacity: 0.9;
  }

  .lane {
    width: 150px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .tile {
    width: 150px;
    height: 150px;
    display: block;
    flex-shrink: 0;
  }

  .lane-down {
    animation: slide-down 10s linear infinite;
  }

  .lane-up {
    animation: slide-up 10s linear infinite;
  }

  @keyframes slide-down {
    from {
      transform: translateY(-180px);
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
      transform: translateY(-180px);
    }
  }
</style>
