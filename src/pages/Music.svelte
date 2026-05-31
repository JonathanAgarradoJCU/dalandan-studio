<script>
  let iframe1Loaded = $state(false);
  let iframe2Loaded = $state(false);
</script>

<main class="main-content">
  <div class="spotify-embeds">
    <div class="embed-wrapper">
      {#if !iframe1Loaded}
        <div class="loading-dots">
          <div class="spinner">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      {/if}
      <iframe
        data-testid="embed-iframe"
        style="border-radius:12px"
        src="https://open.spotify.com/embed/track/0lEySQ9mHBlX4rHZu7m4Mn?utm_source=generator"
        width="100%"
        height="152"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify track embed"
        onload={() => iframe1Loaded = true}
      ></iframe>
    </div>
    <div class="embed-wrapper">
      {#if !iframe2Loaded}
        <div class="loading-dots">
          <div class="spinner">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      {/if}
      <iframe
        data-testid="embed-iframe"
        style="border-radius:12px"
        src="https://open.spotify.com/embed/track/702FidTJTHN655G6mah1F9?utm_source=generator"
        width="100%"
        height="152"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify track embed"
        onload={() => iframe2Loaded = true}
      ></iframe>
    </div>
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
    min-height: calc(100vh - 200px);
  }

  .spotify-embeds {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }

  .embed-wrapper {
    position: relative;
    width: 100%;
    height: 152px;
  }

  .loading-dots {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: rgba(233, 185, 112, 0.1);
    border-radius: 12px;
  }

  .spinner {
    position: relative;
    width: 40px;
    height: 40px;
    animation: spin 1.5s linear infinite;
  }

  .dot {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: var(--color-primary);
    border-radius: 50%;
    top: 50%;
    left: 50%;
  }

  .dot:nth-child(1) {
    transform: translate(-50%, -50%) translateY(-16px);
    background-color: #47b2e0dd;
  }

  .dot:nth-child(2) {
    transform: translate(-50%, -50%) rotate(72deg) translateY(-16px) rotate(-72deg);
  }

  .dot:nth-child(3) {
    transform: translate(-50%, -50%) rotate(144deg) translateY(-16px) rotate(-144deg);
  }

  .dot:nth-child(4) {
    transform: translate(-50%, -50%) rotate(216deg) translateY(-16px) rotate(-216deg);
  }

  .dot:nth-child(5) {
    transform: translate(-50%, -50%) rotate(288deg) translateY(-16px) rotate(-288deg);
  }

  .dot:nth-child(6) {
    transform: translate(-50%, -50%);
    opacity: 0;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
