<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import { githubLanguages } from '../stores/githubStore.js';

  let chartCanvas;
  let chart;
  let loading = $state(true);
  let error = $state(null);
  let languages = $state({});

  function renderChart(data) {
    if (!data || Object.keys(data).length === 0) {
      return;
    }

    if (!chartCanvas) {
      console.error('Canvas element not available');
      return;
    }

    const labels = Object.keys(data);
    const values = Object.values(data);
    const total = values.reduce((a, b) => a + b, 0);

    // Define desired order
    const desiredOrder = ['Svelte', 'Python', 'HTML', 'CSS', 'JavaScript'];
    
    // Reorder labels and values according to desired order
    const orderedLabels = [];
    const orderedValues = [];
    
    desiredOrder.forEach(lang => {
      const index = labels.indexOf(lang);
      if (index !== -1) {
        orderedLabels.push(labels[index]);
        orderedValues.push(values[index]);
      }
    });
    
    // Add any remaining languages not in desired order
    labels.forEach((label, i) => {
      if (!desiredOrder.includes(label)) {
        orderedLabels.push(label);
        orderedValues.push(values[i]);
      }
    });

    const ctx = chartCanvas.getContext('2d');

    // Create pattern function
    function createPattern(colors) {
      const patternCanvas = document.createElement('canvas');
      const stripeWidth = 20;
      patternCanvas.width = stripeWidth * colors.length;
      patternCanvas.height = 40;
      const patternCtx = patternCanvas.getContext('2d');
      
      colors.forEach((color, i) => {
        patternCtx.fillStyle = color;
        patternCtx.fillRect(i * stripeWidth, 0, stripeWidth, 40);
      });
      
      return ctx.createPattern(patternCanvas, 'repeat');
    }

    // Specific color mapping for languages
    const colorMap = {
      'Svelte': '#E63700',
      'JavaScript': '#F7DF1E',
      'CSS': '#663399',
      'HTML': '#FFAA00',
      'Python': '#4B8BBE'
    };

    // Generate colors for each language
    const colors = orderedLabels.map((label) => {
      // Use specific color if defined, otherwise generate one
      if (colorMap[label]) {
        if (Array.isArray(colorMap[label])) {
          // Create pattern
          return createPattern(colorMap[label]);
        }
        // Convert hex to rgba with 0.85 opacity
        const hex = colorMap[label];
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.85)`;
      }
      const index = orderedLabels.indexOf(label);
      const hue = (index * 137.508) % 360;
      return `hsla(${hue}, 70%, 50%, 0.85)`;
    });

    // Rename JavaScript to JS in labels
    const displayLabels = orderedLabels.map(label =>
      label === 'JavaScript' ? 'JS' : label
    );

    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }

    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: displayLabels,
        datasets: [{
          data: orderedValues,
          backgroundColor: colors,
          borderColor: '#182f4d',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff',
              font: {
                size: 12,
                family: 'Arial, sans-serif'
              },
              padding: 12
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = displayLabels[context.dataIndex] || '';
                const value = context.raw || 0;
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${percentage}%`;
              }
            }
          }
        }
      }
    });
  }

  onMount(() => {
    // Use preloaded data from store
    if ($githubLanguages.data) {
      languages = $githubLanguages.data;
      loading = false;
      error = $githubLanguages.error;

      if ($githubLanguages.data) {
        requestAnimationFrame(() => {
          renderChart($githubLanguages.data);
        });
      }
    } else {
      // If store is still loading, subscribe to changes
      const unsubscribe = githubLanguages.subscribe((value) => {
        if (value.data) {
          languages = value.data;
          loading = false;
          error = value.error;
          requestAnimationFrame(() => {
            renderChart(value.data);
          });
        }
      });
      return unsubscribe;
    }
  });
</script>

<div class="chart-container">
  <p class="chart-title">This website was coded in...</p>
  {#if loading}
    <p class="loading-text">Loading repository languages...</p>
  {:else if error}
    <p class="error-text">Error loading data: {error}</p>
  {:else if Object.keys(languages).length === 0}
    <p class="no-data-text">No language data available</p>
  {/if}
  <canvas bind:this={chartCanvas} class="chart-canvas" class:hidden={loading || error || Object.keys(languages).length === 0}></canvas>
</div>

<style>
  .chart-container {
    width: 100%;
    max-width: 500px;
    max-height: 70vh;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #71797E 0%, #4A5568 100%);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
  }

  .chart-title {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    margin-bottom: 1rem;
    text-align: center;
  }

  @media (min-width: 1024px) {
    .chart-container {
      max-width: 375px;
      max-height: 65vh;
      padding: 1.5rem;
    }

    .chart-title {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
  }

  @media (max-width: 1023px) {
    .chart-title {
      font-size: 1.5rem;
    }
  }

  .chart-canvas {
    width: 100%;
    height: 100%;
    max-height: 50vh;
  }

  @media (min-width: 1024px) {
    .chart-canvas {
      max-height: 45vh;
    }
  }

  .chart-canvas.hidden {
    display: none;
  }

  .loading-text,
  .error-text,
  .no-data-text {
    color: white;
    font-size: 1.2rem;
    text-align: center;
    padding: 1rem;
  }

  .error-text {
    color: #ff6b6b;
    background-color: rgba(255, 0, 0, 0.1);
    border-radius: 0.5rem;
  }
</style>
