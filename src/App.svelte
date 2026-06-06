<script>
  import { onMount, tick } from 'svelte';
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
  import { theme } from './stores/themeStore.js';
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
  let currentHash = $state(window.location.hash || '#/');
  let navResizeObserver;

  function updateBackgroundColor() {
    const hash = window.location.hash;
    currentHash = hash || '#/';
    const isDark = $theme === 'dark';

    // Light mode colors
    const lightColors = {
      default: '#182f4d',
      art: '#5c2a2a',
      music: '#2a5c3a',
      it: '#2a2a5c',
    };

    // Dark mode colors (darker shades)
    const darkColors = {
      default: '#0a1a2e',
      art: '#2d1515',
      music: '#152e1d',
      it: '#15152e',
    };

    const colors = isDark ? darkColors : lightColors;

    let color = colors.default;
    let menuColor = isDark ? '#020812' : '#050f1a';

    if (hash === '#/art') {
      color = colors.art;
      menuColor = isDark ? '#0d0707' : '#1a0d0d';
    }
    else if (hash === '#/music') {
      color = colors.music;
      menuColor = isDark ? '#070d09' : '#0d1a12';
    }
    else if (hash === '#/it-portfolio') {
      color = colors.it;
      menuColor = isDark ? '#07070d' : '#0d0d1a';
    }

    document.documentElement.style.setProperty('--color-background', color);
    document.documentElement.style.setProperty('--color-menu-links', menuColor);
  }

  function resetScroll() {
    if (scrollWrapper) {
      scrollWrapper.scrollTop = 0;
    }
  }

  async function syncScrollOffset() {
    await tick();
    const navWrapper = document.querySelector('.nav-wrapper');
    if (navWrapper && scrollWrapper) {
      const h = navWrapper.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--nav-height', `${h}px`);
      scrollWrapper.style.marginTop = `${h}px`;
      scrollWrapper.style.height = `calc(100dvh - ${h}px)`;
    }
  }

  onMount(() => {
    updateBackgroundColor();
    syncScrollOffset();
    const navWrapper = document.querySelector('.nav-wrapper');
    if (navWrapper) {
      navResizeObserver = new ResizeObserver(syncScrollOffset);
      navResizeObserver.observe(navWrapper);
    }
    window.addEventListener('hashchange', updateBackgroundColor);
    window.addEventListener('hashchange', resetScroll);
    window.addEventListener('hashchange', syncScrollOffset);
    window.addEventListener('resize', syncScrollOffset);
    window.visualViewport?.addEventListener('resize', syncScrollOffset);

    // Subscribe to theme changes
    const unsubscribe = theme.subscribe(() => {
      updateBackgroundColor();
    });

    return () => {
      navResizeObserver?.disconnect();
      window.removeEventListener('hashchange', updateBackgroundColor);
      window.removeEventListener('hashchange', resetScroll);
      window.removeEventListener('hashchange', syncScrollOffset);
      window.removeEventListener('resize', syncScrollOffset);
      window.visualViewport?.removeEventListener('resize', syncScrollOffset);
      unsubscribe();
    };
  });
</script>

<Navbar />
<img src={crumpledPaper} alt="" class="crumpled-texture" />
{#if currentHash !== '#/about-me'}
  <SlidingBackground />
{/if}

<div bind:this={scrollWrapper} class="page-scroll-wrapper" class:home-page={currentHash === '#/'} class:art-page={currentHash === '#/art'}>
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
    height: 100dvh;
    object-fit: cover;
    opacity: 0.1;
    z-index: -2;
    pointer-events: none;
  }

  .page-scroll-wrapper {
    margin-top: var(--nav-height);
    height: calc(100vh - var(--nav-height));
    height: calc(100dvh - var(--nav-height));
    overflow-y: scroll;
    width: 100%;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;
    scroll-padding-top: calc(var(--nav-height) + 50px);
  }

  .page-scroll-wrapper.home-page {
    overflow-y: hidden;
  }

  .page-scroll-wrapper.art-page {
    scroll-padding-top: calc(var(--nav-height) + 60px);
  }

  @media (max-width: 1023px) {
    .page-scroll-wrapper.art-page {
      scroll-padding-top: calc(var(--nav-height) + 100px);
    }
  }

  .router-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .page-scroll-wrapper.home-page .router-container {
    min-height: 0;
    overflow: hidden;
  }

  @media (max-width: 1023px) {
    .page-scroll-wrapper.home-page {
      overflow-y: hidden;
    }

    .page-scroll-wrapper.home-page .router-container {
      overflow: hidden;
    }

    .page-scroll-wrapper.art-page {
      scroll-padding-top: calc(var(--nav-height) + 40px);
    }
  }
</style>
