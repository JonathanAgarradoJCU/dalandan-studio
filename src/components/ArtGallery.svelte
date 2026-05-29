<script>
  const placeholders = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Illustration ${i + 1}`,
  }));
</script>

<section class="min-h-screen bg-white px-6 py-20">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-4xl font-bold text-orange-600 mb-10 text-center">
      Art Gallery
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each placeholders as item (item.id)}
        <div
          class="aspect-square rounded-2xl bg-orange-100 flex items-center justify-center text-orange-400 text-lg font-medium shadow-sm hover:shadow-md transition-shadow"
        >
          {item.title}
        </div>
      {/each}
    </div>
  </div>
</section>
