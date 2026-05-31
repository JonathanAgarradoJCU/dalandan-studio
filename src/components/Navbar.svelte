<script>
  import { onMount, onDestroy } from 'svelte';
  import { circlesMode, circlesAnimating } from '../stores/circlesStore.js';

  let menuOpen = $state(false);
  let clickedLink = $state('');
  let resizeTimer;
  let mode = $state('hero');
  let circlesVisible = $state(false);
  let isAnimating = $state(false);

  function handleNavCircleClick(route) {
    if (route === '#/') {
      // Going to home - fade out circles first
      circlesVisible = false;
      circlesAnimating.set(true);
      setTimeout(() => {
        circlesMode.set('hero');
        window.location.hash = route;
      }, 350);
    } else {
      // Going to another page - navigate immediately
      window.location.hash = route;
    }
  }

  function handleLogoError(event) {
    event.currentTarget.src = '/src/assets/logos/dalandan-transparent-cropped.png';
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu(event) {
    triggerClickEffect(event);
    menuOpen = false;
    event.currentTarget.blur();
  }

  function triggerClickEffect(event) {
    const href = event.currentTarget.getAttribute('href');
    clickedLink = href;
  }

  function handleResize() {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 100);
  }

  function syncActiveRoute() {
    clickedLink = window.location.hash || '#/';
    if (clickedLink === '#/' || clickedLink === '') {
      circlesMode.set('hero');
      circlesAnimating.set(false);
    } else if (clickedLink === '#/art' || clickedLink === '#/music' || clickedLink === '#/it-portfolio' || clickedLink === '#/about-me' || clickedLink === '#/contact-me') {
      circlesMode.set('nav');
      circlesAnimating.set(false);
    } else {
      circlesMode.set('hero');
      circlesAnimating.set(false);
    }
  }

  onMount(() => {
    syncActiveRoute();
    window.addEventListener('hashchange', syncActiveRoute);
    window.addEventListener('resize', handleResize);
    
    // Subscribe to circlesAnimating
    const animatingUnsubscribe = circlesAnimating.subscribe(value => {
      isAnimating = value;
    });
    
    // Subscribe to circles mode
    const unsubscribe = circlesMode.subscribe(value => {
      mode = value;
      if (value === 'nav') {
        // Always fade in when entering nav mode
        setTimeout(() => {
          circlesVisible = true;
          circlesAnimating.set(false);
        }, 350);
      } else {
        circlesVisible = false;
      }
    });
    
    return () => {
      unsubscribe();
      animatingUnsubscribe();
    };
  });

  onDestroy(() => {
    window.removeEventListener('hashchange', syncActiveRoute);
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimer);
  });
</script>

<div class="nav-wrapper">
  <nav class="navbar">
    <div class="nav-logo-container">
      <a href="#/" class="logo-link" aria-label="DalanDan Studio">
        <img src="/src/assets/logos/dalandan-transparent-cropped.svg" alt="DalanDan Studio Logo" class="logo-image" onerror={handleLogoError} />
      </a>
      <div class="nav-logo">
        <a href="#/">DalanDan Studio</a>
      </div>
    </div>

    {#if mode === 'nav'}
      <div class="mobile-circles">
        <button class="nav-circle nav-circle-red" class:visible={circlesVisible} class:active={clickedLink === '#/art'} onclick={() => handleNavCircleClick('#/art')} aria-label="Art"></button>
        <button class="nav-circle nav-circle-green" class:visible={circlesVisible} class:active={clickedLink === '#/music'} onclick={() => handleNavCircleClick('#/music')} aria-label="Music"></button>
        <button class="nav-circle nav-circle-blue" class:visible={circlesVisible} class:active={clickedLink === '#/it-portfolio'} onclick={() => handleNavCircleClick('#/it-portfolio')} aria-label="IT Portfolio"></button>
      </div>
    {/if}

    <ul class="desktop-links">
      <li><a href="#/" class:clicked={clickedLink === '#/'} onclick={triggerClickEffect}>Home</a></li>
      {#if mode === 'nav'}
        <li class="nav-circles">
          <button class="nav-circle nav-circle-red" class:visible={circlesVisible} class:active={clickedLink === '#/art'} onclick={() => handleNavCircleClick('#/art')} aria-label="Art"></button>
          <button class="nav-circle nav-circle-green" class:visible={circlesVisible} class:active={clickedLink === '#/music'} onclick={() => handleNavCircleClick('#/music')} aria-label="Music"></button>
          <button class="nav-circle nav-circle-blue" class:visible={circlesVisible} class:active={clickedLink === '#/it-portfolio'} onclick={() => handleNavCircleClick('#/it-portfolio')} aria-label="IT Portfolio"></button>
        </li>
      {/if}
      <li>
        <a href="#/about-me" class:clicked={clickedLink === '#/about-me'} onclick={triggerClickEffect}>About Me</a>
      </li>
      <li>
        <a href="#/contact-me" class:clicked={clickedLink === '#/contact-me'} onclick={triggerClickEffect}>
          Contact Me
        </a>
      </li>
    </ul>

    <button class="menu-toggle" aria-label="Toggle navigation" onclick={toggleMenu}>
      {menuOpen ? '✕' : '☰'}
    </button>
  </nav>

  <ul class="menu-links" class:active={menuOpen}>
    <li><a href="#/" class:clicked={clickedLink === '#/'} onclick={closeMenu}>Home</a></li>
    <li class="circle-menu-link menu-link-red"><a href="#/art" class:clicked={clickedLink === '#/art'} onclick={closeMenu}>Art</a></li>
    <li class="circle-menu-link menu-link-green"><a href="#/music" class:clicked={clickedLink === '#/music'} onclick={closeMenu}>Music</a></li>
    <li class="circle-menu-link menu-link-blue"><a href="#/it-portfolio" class:clicked={clickedLink === '#/it-portfolio'} onclick={closeMenu}>IT Portfolio</a></li>
    <li><a href="#/about-me" class:clicked={clickedLink === '#/about-me'} onclick={closeMenu}>About Me</a></li>
    <li>
      <a href="#/contact-me" class:clicked={clickedLink === '#/contact-me'} onclick={closeMenu}>Contact Me</a>
    </li>
  </ul>
</div>

<style>
  .nav-wrapper {
    position: sticky;
    top: 0;
    z-index: 1000;
    flex-shrink: 0;
  }

  .navbar {
    background-color: transparent;
    color: var(--color-text-muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: relative;
    z-index: 101;
  }

  .nav-logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo-image {
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .logo-image:hover {
    transform: scale(1.1);
  }

  .nav-logo a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
  }

  /* Desktop nav links */
  .desktop-links {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    align-items: center;
  }

  .nav-circles {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .nav-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: var(--shadow-card);
    cursor: pointer;
    border: none;
    transition: transform 0.2s ease, opacity 0.35s ease, width 0.2s ease, height 0.2s ease;
    opacity: 0;
  }

  .nav-circle:hover {
    transform: scale(1.1);
  }

  .nav-circle.visible {
    opacity: 1;
  }

  .nav-circle.active {
    width: 48px;
    height: 48px;
  }

  .nav-circle-red {
    background-color: rgba(255, 0, 0, 0.65);
  }

  .nav-circle-green {
    background-color: rgba(0, 255, 0, 0.65);
  }

  .nav-circle-blue {
    background-color: rgba(0, 0, 255, 0.65);
  }

  .mobile-circles {
    display: none;
    gap: 0.5rem;
    align-items: center;
  }

  .desktop-links a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 400;
    padding: 0.25rem 0.6rem;
    border-radius: 0.5rem;
    transition:
      background-color 0.3s,
      color 0.3s;
  }

  .desktop-links a:hover {
    background-color: var(--color-hover);
    color: #000000;
    text-shadow: none;
  }

  .desktop-links a.clicked,
  .menu-links a.clicked {
    background-color: var(--color-hover);
    color: #000000;
    text-shadow: none;
  }

  /* Menu toggle button */
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--color-text);
    font-size: 1.8rem;
    font-weight: 400;
    cursor: pointer;
    z-index: 110;
    width: 30px;
    text-align: center;
  }

  /* Mobile menu links */
  .menu-links {
    display: none;
    flex-direction: column;
    list-style: none;
    gap: 1.5rem;
    position: fixed;
    top: var(--nav-height);
    right: 0;
    z-index: 100;
    width: max-content;
    max-width: calc(100vw - 2rem);
    box-sizing: border-box;
    margin: 0;
    background-color: rgba(204, 170, 118, 0.15);
    border-radius: 1rem 0 0 1rem;
    padding: 1rem;
    text-align: center;
    transform: translateX(100%);
    transition: transform 0.4s ease-in-out;
    box-shadow: var(--shadow-nav-dropdown);
  }

  .menu-links.active {
    transform: translateX(0);
  }

  .menu-links a {
    display: block;
    color: #ffffff;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 400;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.8);
    transition:
      background-color 0.3s,
      color 0.3s;
  }

  .menu-links a:hover {
    color: var(--color-hover);
  }

  .circle-menu-link {
    display: none;
  }

  .menu-link-red {
    background-color: rgba(255, 0, 0, 0.65);
  }

  .menu-link-green {
    background-color: rgba(0, 255, 0, 0.65);
  }

  .menu-link-blue {
    background-color: rgba(0, 0, 255, 0.65);
  }

  @media (max-width: 870px) {
    .desktop-links {
      display: none;
    }

    .nav-circles {
      display: none;
    }

    .mobile-circles {
      display: flex;
    }

    .nav-circle {
      width: 39px;
      height: 39px;
    }

    .nav-circle.active {
      width: 62.4px;
      height: 62.4px;
    }

    .menu-toggle {
      display: block;
    }

    .menu-links {
      display: flex;
    }

    .menu-links a:hover,
    .menu-links a:active {
      background-color: var(--color-hover);
      color: #000000;
      text-shadow: none;
    }
  }

  @media (max-width: 1089px) {
    .nav-logo {
      display: none;
    }
  }

  @media (max-width: 515px) {
    .nav-circle {
      width: 30px;
      height: 30px;
    }

    .nav-circle.active {
      width: 48px;
      height: 48px;
    }
  }

  @media (max-width: 370px) {
    .mobile-circles {
      display: none;
    }

    .circle-menu-link {
      display: block;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
    }

    .circle-menu-link a {
      color: #ffffff;
      text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.8);
    }
  }
</style>
