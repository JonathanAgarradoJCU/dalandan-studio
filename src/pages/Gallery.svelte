<script>
  import { galleryItems, categories } from '../data/galleryData.js';
  import { onMount } from 'svelte';

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

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  $: filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);
</script>

<main class="gallery-page">
  <div class="gallery-header">
    <h1>Art Gallery</h1>
    <p>A collection of my artwork, commissions, and sketches</p>
  </div>

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
  .gallery-page {
    flex: 1;
    padding: 3rem 2rem;
    max-width: var(--content-max-width);
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 200px);
  }

  .gallery-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .gallery-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text);
  }

  .gallery-header p {
    color: var(--color-text-muted);
    font-size: 1.1rem;
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

  /* Responsive grid */
  @media (max-width: 1400px) {
    .gallery-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 1023px) {
    .gallery-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .gallery-page {
      padding: 2rem 1.5rem;
    }

    .gallery-header h1 {
      font-size: 2rem;
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
