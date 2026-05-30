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

  <button
    class="menu-toggle"
    aria-label="Toggle navigation"
    onclick={toggleMenu}
  >
    {menuOpen ? '✕' : '☰'}
  </button>

  <ul class="nav-links" class:active={menuOpen}>
    <li><a href="#/" onclick={closeMenu}>Home</a></li>
    <li><a href="#/contact-me" onclick={closeMenu}>Contact Me</a></li>
    <li><a href="#/about-me" onclick={closeMenu}>About Me</a></li>
  </ul>
</nav>

<style>
  .navbar {
  background-color: #ccaa76;
    color: #ceb9b9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo a {
    color: #000000;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: 1.5rem;
  }

  .nav-links a {
    color: #000000;
    text-decoration: none;
    font-size: 1rem;
    font-weight: bold;
    transition: color 0.3s;
  }

  .nav-links a:hover {
    color: #ffffff;
    font-weight: bold;
  }

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    color: #000000;
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
      background-color: #ccaa76d5;
      padding: 2rem 0;
      text-align: center;
      transform: translateY(-150%);
      transition: transform 0.4s ease-in-out;
      z-index: 50;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    }

    .nav-links.active {
      transform: translateY(0);
    }
  }

  @media (min-width: 769px) {
    .nav-links {
      transform: none !important;
    }
  }
</style>
