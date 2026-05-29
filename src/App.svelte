<script>
  import Navbar from './components/Navbar.svelte';
  import Footer from './components/Footer.svelte';
</script>

<Navbar />

<main class="main-content">
  <h1>Dalandan Studio is coming soon! 🍊</h1>
</main>

<Footer />

<style>
  .main-content {
    flex: 1;
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .main-content h1 {
    font-size: 2.5rem;
    font-family: Arial, sans-serif;
    font-style: italic;
  }
</style>
