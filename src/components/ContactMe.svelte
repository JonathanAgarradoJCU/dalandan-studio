<script>
  const tiers = [
    {
      name: 'Sketch',
      price: '$XX',
      description: 'Line-art sketch, 1 character, simple background.',
    },
    {
      name: 'Full Color',
      price: '$XX',
      description: 'Fully rendered illustration, 1 character, detailed background.',
    },
    {
      name: 'Custom',
      price: 'Ask',
      description: 'Multi-character, complex scenes, or special requests.',
    },
  ];
</script>

<section class="min-h-screen bg-white px-6 py-20">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-4xl font-bold text-orange-600 mb-10 text-center">
      Commissions &amp; Contact
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {#each tiers as tier}
        <div
          class="rounded-2xl border-2 border-orange-200 p-6 text-center hover:border-orange-400 transition-colors"
        >
          <h3 class="text-xl font-bold text-gray-800 mb-1">{tier.name}</h3>
          <p class="text-3xl font-extrabold text-orange-600 mb-3">
            {tier.price}
          </p>
          <p class="text-gray-600 text-sm">{tier.description}</p>
        </div>
      {/each}
    </div>

    <div class="max-w-xl mx-auto">
      <h3 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Get in Touch
      </h3>
      <form class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
            placeholder="Your name"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            rows="4"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition resize-y"
            placeholder="Describe what you're looking for..."
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
</section>
