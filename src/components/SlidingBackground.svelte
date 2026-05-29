<div class="sliding-background"></div>

<style>
  .sliding-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url('../assets/cross-pattern.png');
    background-repeat: repeat;
    background-size: 150px 150px;
    opacity: 0.2;
    z-index: 1;
    pointer-events: none;
    animation: slide 10s linear infinite;
  }

  @keyframes slide {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 150px 150px;
    }
  }
</style>
