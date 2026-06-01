<script>
  import { onMount } from 'svelte';
  import { artActiveSection } from '../stores/circlesStore.js';

  const sectionNames = {
    commissions: 'Commissions',
    tos: 'Terms of Service',
    gallery: 'Gallery',
    test1: 'Test 1',
    test2: 'Test 2',
    test3: 'Test 3',
    test4: 'Test 4',
    test5: 'Test 5',
    test6: 'Test 6',
    test7: 'Test 7',
    test8: 'Test 8',
  };

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onMount(() => {
    const ids = ['commissions', 'tos', 'gallery', 'test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8'];
    const scrollContainer = document.querySelector('.page-scroll-wrapper');

    function getNavHeight() {
      const nav = document.querySelector('.nav-wrapper');
      return nav ? nav.getBoundingClientRect().height : 0;
    }

    function updateActiveSection() {
      const threshold = getNavHeight() + 92;
      let currentId = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentId = id;
        }
      }
      artActiveSection.set(sectionNames[currentId]);
    }

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateActiveSection);
      updateActiveSection();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateActiveSection);
      }
    };
  });
</script>

<main class="art-page">
  <aside class="outline">
    <nav class="outline-nav" aria-label="Art page sections">
      <button class="outline-link" onclick={() => scrollToSection('commissions')}>Commissions</button>
      <button class="outline-link" onclick={() => scrollToSection('tos')}>Terms of Service</button>
      <button class="outline-link" onclick={() => scrollToSection('gallery')}>Gallery</button>
      <button class="outline-link" onclick={() => scrollToSection('test1')}>Test 1</button>
      <button class="outline-link" onclick={() => scrollToSection('test2')}>Test 2</button>
      <button class="outline-link" onclick={() => scrollToSection('test3')}>Test 3</button>
      <button class="outline-link" onclick={() => scrollToSection('test4')}>Test 4</button>
      <button class="outline-link" onclick={() => scrollToSection('test5')}>Test 5</button>
      <button class="outline-link" onclick={() => scrollToSection('test6')}>Test 6</button>
      <button class="outline-link" onclick={() => scrollToSection('test7')}>Test 7</button>
      <button class="outline-link" onclick={() => scrollToSection('test8')}>Test 8</button>
    </nav>
  </aside>

  <div class="art-sections">
    <section id="commissions" class="art-section">
      <h2>Commissions</h2>
      <p>Commission information goes here.</p>
    </section>
    <section id="tos" class="art-section">
      <h2>Terms of Service</h2>
      <p>TOS information goes here.</p>
    </section>
    <section id="gallery" class="art-section">
      <h2>Gallery</h2>
      <p>Gallery content goes here.</p>
    </section>
    <section id="test1" class="art-section">
      <h2>Test 1</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
    <section id="test2" class="art-section">
      <h2>Test 2</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
    <section id="test3" class="art-section">
      <h2>Test 3</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
    <section id="test4" class="art-section">
      <h2>Test 4</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
    <section id="test5" class="art-section">
      <h2>Test 5</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
    <section id="test6" class="art-section">
      <h2>Test 6</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
    <section id="test7" class="art-section">
      <h2>Test 7</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
    <section id="test8" class="art-section">
      <h2>Test 8</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </section>
  </div>
</main>

<style>
  .art-page {
    flex: 1;
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding: 3rem 2rem;
    max-width: var(--content-max-width);
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 200px);
  }

  .outline {
    flex: 0 0 200px;
    position: sticky;
    top: calc(var(--nav-height) + 2rem);
    align-self: flex-start;
    height: fit-content;
  }

  .outline-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .outline-link {
    background: none;
    border: none;
    font-family: var(--font-family-base);
    font-size: 1rem;
    color: var(--color-text);
    text-align: left;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: background-color 0.2s, color 0.2s;
    text-shadow: inherit;
  }

  .outline-link:hover {
    background-color: rgba(233, 185, 112, 0.2);
    color: var(--color-hover);
  }

  .art-sections {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .art-section {
    background-color: rgba(233, 185, 112, 0.1);
    border-radius: var(--border-radius-card);
    padding: 2rem;
    box-shadow: var(--shadow-card);
  }

  .art-section h2 {
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  .art-section p {
    color: var(--color-text);
  }

  @media (max-width: 1023px) {
    .art-page {
      flex-direction: column;
    }

    .outline {
      display: none;
    }
  }
</style>
