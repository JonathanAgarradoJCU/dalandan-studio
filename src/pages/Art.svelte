<script>
  import { onMount } from 'svelte';
  import { artActiveSection } from '../stores/circlesStore.js';
  import { galleryItems, categories } from '../data/galleryData.js';

  const sectionNames = {
    gallery: 'Gallery',
    commissions: 'Commissions',
    tos: 'Terms of Service',
  };

  let selectedCategory = 'all';
  let lightboxOpen = false;
  let selectedImage = null;

  function openLightbox(item) {
    selectedImage = item;
    lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOpen = false;
    selectedImage = null;
    document.body.style.overflow = '';
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && lightboxOpen) {
      closeLightbox();
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      const scrollContainer = document.querySelector('.page-scroll-wrapper');
      const navWrapper = document.querySelector('.nav-wrapper');
      if (scrollContainer && navWrapper) {
        const navHeight = navWrapper.getBoundingClientRect().height;
        const sectionsToggleHeight = window.innerWidth <= 1023 ? 40 : 0;
        const offset = navHeight + sectionsToggleHeight;
        const elPosition = el.offsetTop;
        scrollContainer.scrollTo({
          top: elPosition - offset,
          behavior: 'smooth'
        });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  $: filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  onMount(() => {
    const ids = ['gallery', 'commissions', 'tos'];
    const scrollContainer = document.querySelector('.page-scroll-wrapper');

    function getNavHeight() {
      const nav = document.querySelector('.nav-wrapper');
      return nav ? nav.getBoundingClientRect().height : 0;
    }

    function updateActiveSection() {
      const threshold = getNavHeight() + 124;
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

    window.addEventListener('keydown', handleKeydown);

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateActiveSection);
      updateActiveSection();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateActiveSection);
      }
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<main class="art-page">
  <div class="art-sections">
    <section class="hero-section">
      <h1>Art Gallery & Commissions</h1>
      <p>Welcome to my art page! Browse my gallery of past commissions and personal artwork, or check out my pricing tiers below if you're interested in commissioning me.</p>
      <div class="status-badge">
        <span class="status-dot"></span>
        <span class="status-text">Commissions: On Hold</span>
      </div>
    </section>

    <section id="gallery" class="art-section gallery-section">
      <h2>Gallery</h2>
      <div class="filter-container">
        {#each categories as category}
          <button
            class="filter-button"
            class:active={selectedCategory === category.id}
            onclick={() => selectedCategory = category.id}
          >
            {category.label}
          </button>
        {/each}
      </div>

      <div class="gallery-grid">
        {#each filteredItems as item}
          <button
            class="artwork-card"
            onclick={() => openLightbox(item)}
            onkeydown={(e) => e.key === 'Enter' && openLightbox(item)}
            aria-label={`View ${item.title}`}
          >
            <div class="artwork-image-wrapper">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div class="artwork-overlay">
                <div class="artwork-info">
                  <h3>{item.title}</h3>
                  {#if item.client}
                    <p class="client">Client: {item.client}</p>
                  {/if}
                  <p class="year">{item.year}</p>
                </div>
              </div>
            </div>
          </button>
        {/each}
      </div>

      {#if filteredItems.length === 0}
        <div class="empty-state">
          <p>No artwork found in this category.</p>
        </div>
      {/if}
    </section>

    <section id="commissions" class="art-section">
      <h2>Commissions</h2>
      <div class="pricing-tiers">
        <div class="pricing-card">
          <div class="pricing-header">
            <h3>Headshot</h3>
            <div class="price">$XX</div>
          </div>
          <ul class="pricing-features">
            <li>Shoulders up</li>
            <li>Simple background</li>
 <li>1 revision included</li>
            <li>High-res delivery</li>
          </ul>
          <a href="mailto:dalandan-studio@gmail.com?subject=Commission Request - Headshot&body=Hi! I'm interested in commissioning a Headshot tier." class="cta-button">Request</a>
        </div>

        <div class="pricing-card featured">
          <div class="pricing-badge">Popular</div>
          <div class="pricing-header">
            <h3>Half-body</h3>
            <div class="price">$XX</div>
          </div>
          <ul class="pricing-features">
            <li>Waist up</li>
            <li>Detailed background</li>
            <li>2 revisions included</li>
            <li>High-res delivery</li>
            <li>Progress updates</li>
          </ul>
          <a href="mailto:dalandan-studio@gmail.com?subject=Commission Request - Half-body&body=Hi! I'm interested in commissioning a Half-body tier." class="cta-button">Request</a>
        </div>

        <div class="pricing-card">
          <div class="pricing-header">
            <h3>Full-body</h3>
            <div class="price">$XX</div>
          </div>
          <ul class="pricing-features">
            <li>Full character</li>
            <li>Complex background</li>
            <li>3 revisions included</li>
            <li>High-res delivery</li>
            <li>Progress updates</li>
            <li>Source file</li>
          </ul>
          <a href="mailto:dalandan-studio@gmail.com?subject=Commission Request - Full-body&body=Hi! I'm interested in commissioning a Full-body tier." class="cta-button">Request</a>
        </div>
      </div>
    </section>

    <section id="tos" class="art-section">
      <h2>Terms of Service</h2>
      <div class="tos-content">
        <div class="tos-section">
          <h3>Payment</h3>
          <p>Payment is required upfront via PayPal or other agreed methods. Prices are in USD. Additional fees may apply for complex designs or rushed orders.</p>
        </div>
        <div class="tos-section">
          <h3>Revisions</h3>
          <p>Each tier includes a specific number of revisions. Additional revisions may incur extra fees. Major changes to the initial concept may be treated as a new commission.</p>
        </div>
        <div class="tos-section">
          <h3>Usage Rights</h3>
          <p>You retain rights to use the commissioned artwork for personal use. Commercial use requires additional discussion and fees. I retain the right to display the artwork in my portfolio.</p>
        </div>
        <div class="tos-section">
          <h3>Refund Policy</h3>
          <p>Refunds are available if work has not started. Once work begins, refunds are prorated based on completion. No refunds after final delivery.</p>
        </div>
        <div class="tos-section">
          <h3>Timeline</h3>
          <p>Typical turnaround time is 1-3 weeks depending on complexity and current queue. You will receive progress updates at key stages.</p>
        </div>
      </div>
    </section>
  </div>
</main>

{#if lightboxOpen && selectedImage}
  <div
    class="lightbox"
    onclick={closeLightbox}
    onkeydown={(e) => e.key === 'Escape' && closeLightbox()}
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
    tabindex="-1"
  >
    <button class="lightbox-close" onclick={closeLightbox} aria-label="Close lightbox">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 8L24 24M24 8L8 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <div class="lightbox-content" role="document">
      <img src={selectedImage.image} alt={selectedImage.title} />
      <div class="lightbox-info">
        <h2>{selectedImage.title}</h2>
        {#if selectedImage.client}
          <p class="client">Client: {selectedImage.client}</p>
        {/if}
        <p class="year">{selectedImage.year}</p>
        {#if selectedImage.description}
          <p class="description">{selectedImage.description}</p>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .art-page {
    flex: 1;
    padding: 3rem 2rem;
    max-width: var(--content-max-width);
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 200px);
  }

  .art-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .art-section {
    background-color: rgba(233, 185, 112, 0.9);
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

  .hero-section {
    background: linear-gradient(135deg, rgba(50, 0, 0, 0.3), rgba(50, 0, 0, 0.15));
    border-radius: var(--border-radius-card);
    padding: 3rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .art-section:not(:first-of-type) {
    background-color: rgba(50, 0, 0, 0.9);
  }

  .art-section:first-of-type {
    background-color: rgba(50, 0, 0, 0.25);
  }

  .hero-section h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  .hero-section p {
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto 1.5rem;
    color: var(--color-text);
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(255, 193, 7, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    border: 1px solid rgba(255, 193, 7, 0.4);
  }

  .status-dot {
    width: 10px;
    height: 10px;
    background-color: #ffc107;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .status-text {
    color: var(--color-text);
    font-weight: 600;
  }

  .pricing-tiers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .pricing-card {
    background-color: rgba(233, 185, 112, 0.15);
    border: 2px solid rgba(233, 185, 112, 0.3);
    border-radius: var(--border-radius-card);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .pricing-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(233, 185, 112, 0.5);
  }

  .pricing-card.featured {
    border-color: var(--color-primary);
    background-color: rgba(233, 185, 112, 0.25);
  }

  .pricing-badge {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--color-primary);
    color: #182f4d;
    padding: 0.25rem 1rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .pricing-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .pricing-header h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }

  .price {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-hover);
  }

  .pricing-features {
    list-style: none;
    flex: 1;
    margin-bottom: 1.5rem;
  }

  .pricing-features li {
    padding: 0.5rem 0;
    color: var(--color-text);
    position: relative;
    padding-left: 1.5rem;
  }

  .pricing-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-hover);
    font-weight: bold;
  }

  .cta-button {
    background-color: var(--color-primary);
    color: #182f4d;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }

  .cta-button:hover {
    background-color: #d4a85f;
  }

  .tos-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .tos-section h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--color-hover);
  }

  .tos-section p {
    line-height: 1.7;
    color: var(--color-text);
  }

  /* Gallery styles */
  .gallery-section {
    background-color: rgba(50, 0, 0, 0.9);
  }

  .filter-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .filter-button {
    background-color: rgba(100, 30, 30, 0.3);
    border: 2px solid rgba(100, 30, 30, 0.5);
    color: var(--color-text);
    padding: 0.6rem 1.5rem;
    border-radius: 2rem;
    cursor: pointer;
    font-family: var(--font-family-base);
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }

  .filter-button:hover {
    background-color: rgba(100, 30, 30, 0.5);
    border-color: rgba(100, 30, 30, 0.7);
  }

  .filter-button.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: #182f4d;
    font-weight: 600;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  .artwork-card {
    background-color: rgba(100, 30, 30, 0.3);
    border-radius: var(--border-radius-card);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: var(--shadow-card);
  }

  .artwork-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .artwork-image-wrapper {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
  }

  .artwork-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .artwork-card:hover .artwork-image-wrapper img {
    transform: scale(1.05);
  }

  .artwork-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    padding: 1rem;
  }

  .artwork-card:hover .artwork-overlay {
    opacity: 1;
  }

  .artwork-info {
    color: white;
  }

  .artwork-info h3 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .artwork-info .client {
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: 0.1rem;
  }

  .artwork-info .year {
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--color-text-muted);
    font-size: 1.1rem;
  }

  /* Lightbox styles */
  .lightbox {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .lightbox-close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }

  .lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .lightbox-content {
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .lightbox-content img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    border-radius: var(--border-radius-card);
  }

  .lightbox-info {
    text-align: center;
    color: white;
  }

  .lightbox-info h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .lightbox-info .client {
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 0.25rem;
  }

  .lightbox-info .year {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-bottom: 0.5rem;
  }

  .lightbox-info .description {
    font-size: 1rem;
    opacity: 0.8;
    max-width: 600px;
    line-height: 1.6;
  }

  @media (max-width: 1023px) {
    .art-page {
      padding: 2rem 1.5rem;
    }

    .hero-section h1 {
      font-size: 2rem;
    }

    .pricing-tiers {
      grid-template-columns: 1fr;
    }

    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  @media (max-width: 640px) {
    .gallery-grid {
      grid-template-columns: 1fr;
    }

    .filter-container {
      gap: 0.5rem;
    }

    .filter-button {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
    }

    .lightbox-content {
      padding: 1rem;
    }

    .lightbox-content img {
      max-height: 60vh;
    }
  }
</style>
