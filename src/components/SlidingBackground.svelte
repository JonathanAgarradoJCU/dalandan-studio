<div class="sliding-background lane-a"></div>
<div class="sliding-background lane-b"></div>

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

  .lane-a {
    -webkit-mask-image: repeating-linear-gradient(
      45deg,
      black 0px, black 150px,
      transparent 150px, transparent 300px
    );
    mask-image: repeating-linear-gradient(
      45deg,
      black 0px, black 150px,
      transparent 150px, transparent 300px
    );
    animation: slide-diag-forward 10s linear infinite;
  }

  .lane-b {
    -webkit-mask-image: repeating-linear-gradient(
      45deg,
      transparent 0px, transparent 150px,
      black 150px, black 300px
    );
    mask-image: repeating-linear-gradient(
      45deg,
      transparent 0px, transparent 150px,
      black 150px, black 300px
    );
    animation: slide-diag-reverse 10s linear infinite;
  }

  @keyframes slide-diag-forward {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 150px 150px;
    }
  }

  @keyframes slide-diag-reverse {
    from {
      background-position: 0 0;
    }
    to {
      background-position: -150px -150px;
    }
  }
</style>
