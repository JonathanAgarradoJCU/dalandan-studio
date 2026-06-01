<script>
  import { onMount, onDestroy } from 'svelte';
  import { circlesMode, circlesAnimating, artActiveSection } from '../stores/circlesStore.js';
  import logoPng from '../assets/logos/dalandan-transparent-cropped.png';

  let menuOpen = $state(false);
  let clickedLink = $state('');
  let resizeTimer;
  let mode = $state('hero');
  let circlesVisible = $state(false);
  let isAnimating = $state(false);
  let artSectionsOpen = $state(false);

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

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function toggleArtSections() {
    artSectionsOpen = !artSectionsOpen;
  }

  function scrollToArtSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      artSectionsOpen = false;
    }
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
    artSectionsOpen = false;
    menuOpen = false;
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
        <img src={logoPng} alt="DalanDan Studio Logo" class="logo-image" />
      </a>
      <div class="nav-logo">
        <a href="#/">DalanDan Studio</a>
      </div>
    </div>

    {#if mode === 'nav'}
      <div class="mobile-circles">
        <button class="nav-circle nav-circle-red" class:visible={circlesVisible} class:active={clickedLink === '#/art'} tabindex="-1" onclick={() => handleNavCircleClick('#/art')} aria-label="Art">
          <span class="nav-circle-text">Art</span>
        </button>
        <button class="nav-circle nav-circle-green" class:visible={circlesVisible} class:active={clickedLink === '#/music'} tabindex="-1" onclick={() => handleNavCircleClick('#/music')} aria-label="Music">
          <span class="nav-circle-text">Music</span>
        </button>
        <button class="nav-circle nav-circle-blue" class:visible={circlesVisible} class:active={clickedLink === '#/it-portfolio'} tabindex="-1" onclick={() => handleNavCircleClick('#/it-portfolio')} aria-label="IT Portfolio">
          <span class="nav-circle-text">IT</span>
        </button>
      </div>
    {/if}

    <ul class="desktop-links">
      <li><a href="#/" class:clicked={clickedLink === '#/'} onclick={triggerClickEffect}>Home</a></li>
      {#if mode === 'nav'}
        <li class="nav-circles" class:art-active={clickedLink === '#/art'} class:it-active={clickedLink === '#/it-portfolio'}>
          <button class="nav-circle nav-circle-red" class:visible={circlesVisible} class:active={clickedLink === '#/art'} inert={!circlesVisible} onclick={() => handleNavCircleClick('#/art')} aria-label="Art">
            <span class="nav-circle-text">Art</span>
          </button>
          <button class="nav-circle nav-circle-green" class:visible={circlesVisible} class:active={clickedLink === '#/music'} inert={!circlesVisible} onclick={() => handleNavCircleClick('#/music')} aria-label="Music">
            <span class="nav-circle-text">Music</span>
          </button>
          <button class="nav-circle nav-circle-blue" class:visible={circlesVisible} class:active={clickedLink === '#/it-portfolio'} inert={!circlesVisible} onclick={() => handleNavCircleClick('#/it-portfolio')} aria-label="IT Portfolio">
            <span class="nav-circle-text">IT</span>
          </button>
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

  {#if clickedLink === '#/art'}
    <div class="art-sections-bar">
      <button class="sections-toggle" onclick={toggleArtSections} aria-expanded={artSectionsOpen} aria-controls="sections-dropdown">
        <span>{$artActiveSection}</span>
        <span class="toggle-icon" class:open={artSectionsOpen}>&#9662;</span>
      </button>
      <nav id="sections-dropdown" class="sections-dropdown" class:open={artSectionsOpen} aria-label="Art sections">
        <button class="section-btn" onclick={() => scrollToArtSection('commissions')}>Commissions</button>
        <button class="section-btn" onclick={() => scrollToArtSection('tos')}>Terms of Service</button>
        <button class="section-btn" onclick={() => scrollToArtSection('gallery')}>Gallery</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test1')}>Test 1</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test2')}>Test 2</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test3')}>Test 3</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test4')}>Test 4</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test5')}>Test 5</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test6')}>Test 6</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test7')}>Test 7</button>
        <button class="section-btn" onclick={() => scrollToArtSection('test8')}>Test 8</button>
      </nav>
    </div>
  {/if}

  <ul class="menu-links" class:active={menuOpen}>
    <li><a href="#/" class:clicked={clickedLink === '#/'} onclick={closeMenu} tabindex="-1">Home</a></li>
    {#if clickedLink !== '#/' && clickedLink !== ''}
      <li class="circle-menu-link menu-link-red"><a href="#/art" class:clicked={clickedLink === '#/art'} onclick={closeMenu} tabindex="-1">Art</a></li>
      <li class="circle-menu-link menu-link-green"><a href="#/music" class:clicked={clickedLink === '#/music'} onclick={closeMenu} tabindex="-1">Music</a></li>
      <li class="circle-menu-link menu-link-blue"><a href="#/it-portfolio" class:clicked={clickedLink === '#/it-portfolio'} onclick={closeMenu} tabindex="-1">IT Portfolio</a></li>
    {/if}
    <li><a href="#/about-me" class:clicked={clickedLink === '#/about-me'} onclick={closeMenu} tabindex="-1">About Me</a></li>
    <li>
      <a href="#/contact-me" class:clicked={clickedLink === '#/contact-me'} onclick={closeMenu} tabindex="-1">Contact Me</a>
    </li>
  </ul>
</div>

<style>
  .nav-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
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
    width: 64px;
    height: 64px;
    cursor: pointer;
    transition: transform 0.2s ease;
    image-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .logo-image:hover {
    transform: scale(1.1);
  }

  @media (min-width: 1024px) {
    .logo-image {
      width: 80px;
      height: 80px;
    }
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
    transition: transform 0.2s ease, opacity 0.35s ease;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-circle-text {
    color: #ffffff;
    font-size: 0.6rem;
    font-weight: 600;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
  }

  @media (min-width: 1024px) {
    .nav-circles {
      gap: 1.75rem;
      padding-inline: 21.45px;
    }

    .nav-circles.art-active,
    .nav-circles.it-active {
      gap: 0.5rem;
    }

    .nav-circles.art-active .nav-circle-red,
    .nav-circles.it-active .nav-circle-green {
      margin-right: 1.25rem;
    }

    .nav-circles.art-active .nav-circle-green,
    .nav-circles.it-active .nav-circle-blue {
      margin-left: 1.25rem;
    }

    .nav-circle {
      width: 54.6px;
      height: 54.6px;
    }

    .nav-circle-text {
      font-size: 0.7rem;
    }

    .nav-circle.active {
      transform: scale(1.7857);
      animation: bounce 1.5s ease-in-out infinite;
    }

    .nav-circle.active .nav-circle-text {
      font-size: 0.85rem;
    }
  }

  @keyframes bounce {
    0%, 100% {
      transform: scale(1.7857) translateY(0);
    }
    50% {
      transform: scale(1.7857) translateY(-5px);
    }
  }

  .nav-circle:hover {
    transform: scale(1.1);
  }

  .nav-circle.visible {
    opacity: 1;
  }

  .nav-circle-red {
    background-color: rgba(255, 0, 0, 0.5);
  }

  .nav-circle-green {
    background-color: rgba(29, 185, 84, 0.5);
  }

  .nav-circle-blue {
    background-color: rgba(0, 0, 255, 0.5);
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

  .desktop-links a.clicked {
    background-color: var(--color-hover);
    color: #000000;
    text-shadow: none;
  }

  .menu-links a.clicked {
    background-color: #ffffff !important;
    color: #000000;
    text-shadow: none;
    margin-right: -1rem;
    padding-right: 1rem;
    border-radius: 0.5rem 0 0 0.5rem;
  }

  .circle-menu-link:has(a.clicked) {
    background-color: #ffffff !important;
    margin-right: -1rem;
    padding-right: 1rem;
    border-radius: 0.5rem 0 0 0.5rem;
  }

  .circle-menu-link:has(a.clicked) a {
    color: #000000;
    text-shadow: none;
  }

  .menu-link-red:has(a.clicked) a {
    color: #ff0000;
  }

  .menu-link-green:has(a.clicked) a {
    color: #1DB954;
  }

  .menu-link-blue:has(a.clicked) a {
    color: #0000ff;
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
    background-color: var(--color-menu-links);
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

  .art-sections-bar {
    display: none;
  }

  .circle-menu-link {
    display: none;
  }

  .menu-link-red {
    background-color: rgba(255, 0, 0, 0.5);
  }

  .menu-link-green {
    background-color: rgba(29, 185, 84, 0.5);
  }

  .menu-link-blue {
    background-color: rgba(0, 0, 255, 0.5);
  }

  @media (max-width: 1023px) {
    .desktop-links {
      display: none;
    }

    .nav-circles {
      display: none;
    }

    .mobile-circles {
      display: flex;
      gap: 0.75rem;
    }

    .circle-menu-link a {
      font-weight: bold;
    }

    .nav-circle {
      width: 50.7px;
      height: 50.7px;
    }

    .nav-circle-text {
      font-size: 0.7rem;
    }

    .nav-circle.active {
      transform: scale(1.2);
      animation: bounce-mobile 1.5s ease-in-out infinite;
    }

    .nav-circle.active .nav-circle-text {
      font-size: 0.85rem;
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

    .art-sections-bar {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.25rem 1rem 0.5rem;
      background-color: transparent;
    }

    .sections-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      width: 100%;
      max-width: 280px;
      background-color: var(--color-menu-links);
      filter: brightness(1.7);
      border: none;
      font-family: var(--font-family-base);
      font-size: 1rem;
      color: #ffffff;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius-card);
      text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.8);
      transition: background-color 0.2s, color 0.2s;
    }

    .sections-toggle:hover {
      background-color: rgba(233, 185, 112, 0.35);
      color: #ffffff;
    }

    .sections-toggle:active,
    .sections-toggle:focus {
      background-color: var(--color-menu-links);
      outline: none;
    }

    .toggle-icon {
      display: inline-block;
      transition: transform 0.3s ease;
      font-size: 0.8rem;
    }

    .toggle-icon.open {
      transform: rotate(180deg);
    }

    .sections-dropdown {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.3s ease, margin-top 0.3s ease, padding 0.3s ease;
      margin-top: 0;
      padding: 0;
      gap: 0;
      width: 100%;
      max-width: 280px;
    }

    .sections-dropdown.open {
      max-height: 300px;
      opacity: 1;
      margin-top: 0.5rem;
      padding: 0.5rem;
      gap: 0.35rem;
      border-radius: var(--border-radius-card);
      background-color: var(--color-background);
      transition: background-color 0.6s ease;
    }

    .section-btn {
      background: none;
      border: none;
      font-family: var(--font-family-base);
      font-size: 0.85rem;
      color: var(--color-text);
      text-align: center;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: background-color 0.2s, color 0.2s;
      text-shadow: inherit;
      flex: 0 1 auto;
    }

    .section-btn:hover {
      background-color: rgba(233, 185, 112, 0.2);
      color: var(--color-hover);
    }
  }

  @media (max-width: 1023px) {
    .nav-logo {
      display: none;
    }
  }

  @media (max-width: 639px) {
    .mobile-circles {
      gap: 0.55rem;
    }

    .nav-circle {
      width: 42px;
      height: 42px;
    }

    .nav-circle-text {
      font-size: 0.68rem;
    }

    .nav-circle.active {
      transform: scale(1.15);
      animation: bounce-phone 1.5s ease-in-out infinite;
    }

    .nav-circle.active .nav-circle-text {
      font-size: 0.78rem;
    }
  }

  @media (max-width: 359px) {
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

  @keyframes bounce-mobile {
    0%, 100% {
      transform: scale(1.2) translateY(0);
    }
    50% {
      transform: scale(1.2) translateY(-4px);
    }
  }

  @keyframes bounce-phone {
    0%, 100% {
      transform: scale(1.15) translateY(0);
    }
    50% {
      transform: scale(1.15) translateY(-4px);
    }
  }
</style>
