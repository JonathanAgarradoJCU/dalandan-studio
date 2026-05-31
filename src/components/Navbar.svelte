<script>
  import { onMount, onDestroy } from 'svelte';

  let menuOpen = $state(false);
  let resizeTimer;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu() {
    menuOpen = false;
  }

  function handleResize() {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 100);
  }

  onMount(() => {
    window.addEventListener('resize', handleResize);
  });

  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(resizeTimer);
  });
</script>

<div class="nav-wrapper">
  <nav class="navbar">
    <div class="nav-logo">
      <a href="#/">DalanDan Studio</a>
    </div>

    <ul class="desktop-links">
      <li><a href="#/">Home</a></li>
      <li><a href="#/contact-me">Contact Me</a></li>
      <li><a href="#/about-me">About Me</a></li>
    </ul>

    <button class="menu-toggle" aria-label="Toggle navigation" onclick={toggleMenu}>
      {menuOpen ? '✕' : '☰'}
    </button>
  </nav>

  <ul class="menu-links" class:active={menuOpen}>
    <li><a href="#/" onclick={closeMenu}>Home</a></li>
    <li><a href="#/contact-me" onclick={closeMenu}>Contact Me</a></li>
    <li><a href="#/about-me" onclick={closeMenu}>About Me</a></li>
  </ul>
</div>

<style>
  .nav-wrapper {
    position: sticky;
    top: 0;
    z-index: 1000;
    overflow: clip;
    overflow-clip-margin: content-box 0px;
    clip-path: inset(0 0 -100% 0);
  }

  .navbar {
    background-color: var(--color-primary);
    color: var(--color-text-muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: relative;
    z-index: 2;
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
  }

  .desktop-links a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    transition: color 0.3s;
  }

  .desktop-links a:hover {
    color: var(--color-hover);
  }

  /* Menu toggle button */
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--color-text);
    font-size: 1.8rem;
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
    position: relative;
    width: 100%;
    background-color: var(--color-nav-dropdown);
    padding: 2rem 0;
    text-align: center;
    transform: translateY(-100%);
    transition: transform 0.4s ease-in-out;
    z-index: 1;
    box-shadow: var(--shadow-nav-dropdown);
  }

  .menu-links.active {
    transform: translateY(0);
  }

  .menu-links a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    transition: color 0.3s;
  }

  .menu-links a:hover {
    color: var(--color-hover);
  }

  @media (max-width: 768px) {
    .desktop-links {
      display: none;
    }

    .menu-toggle {
      display: block;
    }

    .menu-links {
      display: flex;
    }
  }
</style>
