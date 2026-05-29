<div class="sliding-background layer-1"></div>
<div class="sliding-background layer-2"></div>

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
    opacity: 0.3;
    z-index: 1;
    pointer-events: none;
  }

  .layer-1 {
    animation: slide-forward 10s linear infinite;
  }

  .layer-2 {
    animation: slide-reverse 10s linear infinite;
  }

  @keyframes slide-forward {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 150px 150px;
    }
  }

  @keyframes slide-reverse {
    from {
      background-position: 0 0;
    }
    to {
      background-position: -150px -150px;
    }
  }
</style>
