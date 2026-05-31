<script>
  import Router from 'svelte-spa-router';
  import Navbar from './components/Navbar.svelte';
  import SlidingBackground from './components/SlidingBackground.svelte';
  import Footer from './components/Footer.svelte';
  import Home from './pages/Home.svelte';
  import ContactMe from './pages/ContactMe.svelte';
  import AboutMe from './pages/AboutMe.svelte';
  import crumpledPaper from './assets/crumpled_paper.png';

  const routes = {
    '/': Home,
    '/contact-me': ContactMe,
    '/about-me': AboutMe,
  };
</script>

<Navbar />
<img src={crumpledPaper} alt="" class="crumpled-texture" />
<SlidingBackground />

<div class="router-container">
  <Router {routes} />
</div>

<Footer />

<style>
  .crumpled-texture {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    opacity: 0.7;
    z-index: -2;
    pointer-events: none;
  }

  .router-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>
