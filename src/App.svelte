<script>
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import Navbar from './components/Navbar.svelte';
  import SlidingBackground from './components/SlidingBackground.svelte';
  import Footer from './components/Footer.svelte';
  import Home from './pages/Home.svelte';
  import ContactMe from './pages/ContactMe.svelte';
  import AboutMe from './pages/AboutMe.svelte';
  import Art from './pages/Art.svelte';
  import Music from './pages/Music.svelte';
  import ITPortfolio from './pages/ITPortfolio.svelte';
  import crumpledPaper from './assets/crumpled_paper.webp';

  const routes = {
    '/': Home,
    '/contact-me': ContactMe,
    '/about-me': AboutMe,
    '/art': Art,
    '/music': Music,
    '/it-portfolio': ITPortfolio,
  };

  let scrollWrapper;

  function updateBackgroundColor() {
    const hash = window.location.hash;
    let color = '#182f4d';
    if (hash === '#/art') color = '#5c2a2a';
    else if (hash === '#/music') color = '#2a5c3a';
    else if (hash === '#/it-portfolio') color = '#2a2a5c';
    document.documentElement.style.setProperty('--color-background', color);
  }

  function resetScroll() {
    if (scrollWrapper) {
      scrollWrapper.scrollTop = 0;
    }
  }

  function syncScrollOffset() {
    const navWrapper = document.querySelector('.nav-wrapper');
    if (navWrapper && scrollWrapper) {
      const h = navWrapper.getBoundingClientRect().height;
      scrollWrapper.style.marginTop = `${h}px`;
      scrollWrapper.style.height = `calc(100vh - ${h}px)`;
    }
  }

  onMount(() => {
    updateBackgroundColor();
    syncScrollOffset();
    window.addEventListener('hashchange', updateBackgroundColor);
    window.addEventListener('hashchange', resetScroll);
    window.addEventListener('resize', syncScrollOffset);
    return () => {
      window.removeEventListener('hashchange', updateBackgroundColor);
      window.removeEventListener('hashchange', resetScroll);
      window.removeEventListener('resize', syncScrollOffset);
    };
  });
</script>

<Navbar />
<img src={crumpledPaper} alt="" class="crumpled-texture" />
<SlidingBackground />

<div bind:this={scrollWrapper} class="page-scroll-wrapper">
  <div class="router-container">
    <Router {routes} />
  </div>
  <Footer />
</div>

<style>
  .crumpled-texture {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    opacity: 0.1;
    z-index: -2;
    pointer-events: none;
  }

  .page-scroll-wrapper {
    margin-top: var(--nav-height);
    height: calc(100vh - var(--nav-height));
    overflow-y: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
  }

  .router-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
