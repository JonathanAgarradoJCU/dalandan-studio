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
  import ComputerStuff from './pages/ComputerStuff.svelte';
  import { theme } from './stores/themeStore.js';
  import crumpledPaper from './assets/crumpled_paper.webp';

  const routes = {
    '/': Home,
    '/contact-me': ContactMe,
    '/about-me': AboutMe,
    '/art': Art,
    '/music': Music,
    '/computer-stuff': ComputerStuff,
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
      computer: '#2a2a5c',
    };

    // Dark mode colors (darker shades)
    const darkColors = {
      default: '#02050a',
      art: '#0d0505',
      music: '#050a07',
      computer: '#05050a',
    };

    const colors = isDark ? darkColors : lightColors;

    let color = colors.default;
    let menuColor = isDark ? '#02050a' : '#050f1a';

    if (hash === '#/art') {
      color = colors.art;
      menuColor = isDark ? '#0a0505' : '#1a0d0d';
    }
    else if (hash === '#/music') {
      color = colors.music;
      menuColor = isDark ? '#050a07' : '#0d1a12';
    }
    else if (hash === '#/computer-stuff') {
      color = colors.computer;
      menuColor = isDark ? '#05050a' : '#0d0d1a';
    }

    // Text colors
    const textColor = isDark ? '#ffffff' : '#ffffff';
    const textMuted = isDark ? '#d0d0d0' : '#ffffff';
    const hoverColor = isDark ? '#e9b970' : '#e9b970';

    document.documentElement.style.setProperty('--color-background', color);
    document.documentElement.style.setProperty('--color-menu-links', menuColor);
    document.documentElement.style.setProperty('--color-text', textColor);
    document.documentElement.style.setProperty('--color-text-muted', textMuted);
    document.documentElement.style.setProperty('--color-hover', hoverColor);
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
