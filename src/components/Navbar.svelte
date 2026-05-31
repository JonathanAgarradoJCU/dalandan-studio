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

<nav class="navbar">
  <div class="nav-logo">
    <a href="#/">DalanDan Studio</a>
  </div>

  <ul class="nav-links" class:active={menuOpen}>
    <li><a href="#/" onclick={closeMenu}>Home</a></li>
    <li><a href="#/contact-me" onclick={closeMenu}>Contact Me</a></li>
    <li><a href="#/about-me" onclick={closeMenu}>About Me</a></li>
  </ul>

  <button class="menu-toggle" aria-label="Toggle navigation" onclick={toggleMenu}>
    {menuOpen ? '✕' : '☰'}
  </button>
</nav>

<style>
  .navbar {
    background-color: var(--color-primary);
    color: var(--color-text-muted);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .nav-logo a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    z-index: 90;
  }

  .nav-links a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    transition: color 0.3s;
  }

  .nav-links a:hover {
    color: var(--color-hover);
  }

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

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: var(--color-nav-dropdown);
      padding: 2rem 0;
      text-align: center;
      transform: translateY(-150%);
      transition: transform 0.4s ease-in-out;
      z-index: -1;
      box-shadow: var(--shadow-nav-dropdown);
    }

    .nav-links.active {
      transform: translateY(0);
    }
  }

  @media (min-width: 769px) {
    .nav-links {
      transform: none !important;
      position: static;
      background-color: transparent;
      padding: 0;
      box-shadow: none;
      z-index: auto;
    }
  }
</style>
