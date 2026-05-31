<script>
  import { onMount } from 'svelte';
  import crossPattern from '../assets/cross-pattern.png';

  const TILE_SIZE = 150;
  const GAP = 30;
  const STEP = TILE_SIZE + GAP;

  let laneCount = $state(0);
  let tilesPerLane = $state(0);

  function recalc() {
    laneCount = Math.ceil(window.innerWidth / TILE_SIZE) + 1;
    tilesPerLane = Math.ceil((window.innerHeight + STEP) / STEP) + 1;
  }

  onMount(() => {
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  });
</script>

<div
  class="sliding-container"
  style:--tile-size="{TILE_SIZE}px"
  style:--tile-gap="{GAP}px"
  style:--slide-offset="-{STEP}px"
>
  {#each Array(laneCount) as _lane, i (i)}
    <div class="lane" class:lane-down={i % 2 === 0} class:lane-up={i % 2 !== 0}>
      {#each Array(tilesPerLane) as _tile, j (j)}
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
    justify-content: center;
    opacity: 0.75;
  }

  .lane {
    width: var(--tile-size);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: var(--tile-gap);
  }

  .tile {
    width: var(--tile-size);
    height: var(--tile-size);
    display: block;
    flex-shrink: 0;
  }

  .lane-down {
    animation: slide-down 8.5s alternate infinite;
  }

  .lane-up {
    animation: slide-up 8.5s alternate infinite;
  }

  @keyframes slide-down {
    from {
      transform: translateY(var(--slide-offset));
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
      transform: translateY(var(--slide-offset));
    }
  }
</style>
