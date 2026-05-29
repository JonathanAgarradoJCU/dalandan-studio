<script>
  const tracks = [
    { id: 1, title: 'Track 1', embedUrl: '' },
    { id: 2, title: 'Track 2', embedUrl: '' },
  ];
</script>

<section class="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-20 text-white">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-orange-400 mb-10 text-center">
      Music
    </h2>

    <div class="space-y-8">
      {#each tracks as track (track.id)}
        <div class="bg-gray-700/50 rounded-2xl p-6">
          <h3 class="text-xl font-semibold mb-4">{track.title}</h3>
          {#if track.embedUrl}
            <iframe
              title={track.title}
              src={track.embedUrl}
              width="100%"
              height="152"
              frameborder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              class="rounded-xl"
            ></iframe>
          {:else}
            <div
              class="h-[152px] rounded-xl bg-gray-600 flex items-center justify-center text-gray-400"
            >
              Spotify embed placeholder
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="mt-16">
      <h3 class="text-2xl font-semibold mb-4 text-orange-300">
        Sheet Music &amp; Notation
      </h3>
      <div
        class="bg-gray-700/50 rounded-2xl p-8 flex items-center justify-center min-h-[200px] text-gray-400"
      >
        Sheet notation viewer placeholder
      </div>
    </div>
  </div>
</section>
