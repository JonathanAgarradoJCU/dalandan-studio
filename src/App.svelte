<script>
  import AboutMe from './components/AboutMe.svelte';
  import ArtGallery from './components/ArtGallery.svelte';
  import MusicPlayer from './components/MusicPlayer.svelte';
  import ItPortfolio from './components/ItPortfolio.svelte';
  import ContactMe from './components/ContactMe.svelte';

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'art', label: 'Art Gallery' },
    { id: 'music', label: 'Music' },
    { id: 'portfolio', label: 'IT Portfolio' },
    { id: 'contact', label: 'Contact' },
  ];

  let activeTab = $state('about');
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
  <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <span class="text-xl font-bold text-orange-600">DalanDan Studio</span>
        <div class="flex gap-1">
          {#each tabs as tab (tab.id)}
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}"
              onclick={() => (activeTab = tab.id)}
            >
              {tab.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </nav>

  <main class="flex-1">
    {#if activeTab === 'about'}
      <AboutMe />
    {:else if activeTab === 'art'}
      <ArtGallery />
    {:else if activeTab === 'music'}
      <MusicPlayer />
    {:else if activeTab === 'portfolio'}
      <ItPortfolio />
    {:else if activeTab === 'contact'}
      <ContactMe />
    {/if}
  </main>
</div>
