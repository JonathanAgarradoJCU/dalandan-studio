<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  let chartCanvas;
  let chart;
  let loading = $state(true);
  let error = $state(null);
  let languages = $state({});

  // GitHub repository to fetch languages from
  const owner = 'JonathanAgarradoJCU';
  const repo = 'dalandan-studio';

  async function fetchLanguages() {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      languages = data;
      return data;
    } catch (err) {
      error = err.message;
      console.error('Error fetching GitHub languages:', err);
      return null;
    }
  }

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

    // Specific color mapping for languages
    const colorMap = {
      'Svelte': '#FF3E00',
      'JavaScript': '#F7DF1E',
      'CSS': '#663399',
      'HTML': '#E34F26'
    };

    // Generate colors for each language
    const colors = labels.map((label) => {
      // Use specific color if defined, otherwise generate one
      if (colorMap[label]) {
        return colorMap[label];
      }
      const index = labels.indexOf(label);
      const hue = (index * 137.508) % 360;
      return `hsl(${hue}, 70%, 50%)`;
    });

    // Rename JavaScript to JS in labels
    const displayLabels = labels.map(label => 
      label === 'JavaScript' ? 'JS' : label
    );

    const ctx = chartCanvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }

    chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: displayLabels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: '#182f4d',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#ffffff',
              font: {
                size: 14,
                family: 'Arial, sans-serif'
              },
              padding: 20
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

  onMount(async () => {
    const data = await fetchLanguages();
    loading = false;

    if (data) {
      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        renderChart(data);
      });
    }
  });
</script>

<div class="chart-container">
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
    max-width: 600px;
    max-height: 70vh;
    margin: 0 auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(233, 185, 112, 0.1);
    border-radius: 1rem;
  }

  .chart-canvas {
    width: 100%;
    height: 100%;
    max-height: 60vh;
  }

  .chart-canvas.hidden {
    display: none;
  }

  .loading-text,
  .error-text,
  .no-data-text {
    color: var(--color-text);
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
