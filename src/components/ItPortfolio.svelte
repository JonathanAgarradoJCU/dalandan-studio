<script>
  const projects = [
    {
      id: 1,
      title: 'Project Alpha',
      description: 'A full-stack web application built with modern frameworks.',
      tags: ['Svelte', 'Node.js', 'PostgreSQL'],
    },
    {
      id: 2,
      title: 'Project Beta',
      description: 'Responsive landing page with CMS integration.',
      tags: ['HTML/CSS', 'JavaScript', 'WordPress'],
    },
    {
      id: 3,
      title: 'Project Gamma',
      description: 'E-commerce storefront with payment processing.',
      tags: ['React', 'Stripe', 'Firebase'],
    },
  ];
</script>

<section class="min-h-screen bg-gray-50 px-6 py-20">
  <div class="max-w-5xl mx-auto">
    <h2 class="text-4xl font-bold text-orange-600 mb-10 text-center">
      IT Portfolio
    </h2>
    <div class="space-y-8">
      {#each projects as project (project.id)}
        <div class="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
          <h3 class="text-2xl font-semibold text-gray-800 mb-2">
            {project.title}
          </h3>
          <p class="text-gray-600 mb-4">{project.description}</p>
          <div class="flex flex-wrap gap-2">
            {#each project.tags as tag}
              <span
                class="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-700 font-medium"
              >
                {tag}
              </span>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
