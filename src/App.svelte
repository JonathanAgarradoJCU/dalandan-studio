<script>
  import Router from 'svelte-spa-router';
  import Navbar from './components/Navbar.svelte';
  import SlidingBackground from './components/SlidingBackground.svelte';
  import Footer from './components/Footer.svelte';
  import Home from './pages/Home.svelte';
  import ContactMe from './pages/ContactMe.svelte';
  import AboutMe from './pages/AboutMe.svelte';

  const routes = {
    '/': Home,
    '/contact-me': ContactMe,
    '/about-me': AboutMe,
  };
</script>

<Navbar />
<SlidingBackground />

<Router {routes} />

<Footer />
