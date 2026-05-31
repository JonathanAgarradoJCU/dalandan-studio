<script>
  import { onMount, onDestroy } from 'svelte';

  let menuOpen = $state(false);
  let resizeTimer;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  function closeMenu(event) {
    menuOpen = false;
    event.currentTarget.blur();
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
    font-weight: 400;
    padding: 0.25rem 0.6rem;
    border-radius: 0.5rem;
    text-shadow: 0 0 0 transparent;
    transition:
      background-color 0.3s,
      color 0.3s,
      text-shadow 0.18s ease;
  }

  .desktop-links a:hover {
    background-color: var(--color-hover);
    color: #000000;
    text-shadow:
      0.35px 0 0 currentColor,
      -0.35px 0 0 currentColor;
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
    background-color: var(--color-nav-dropdown);
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
    color: var(--color-text);
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 400;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition:
      background-color 0.3s,
      color 0.3s;
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

    .menu-links a:hover,
    .menu-links a:active {
      background-color: var(--color-hover);
      color: #000000;
    }
  }
</style>
