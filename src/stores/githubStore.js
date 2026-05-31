import { writable } from 'svelte/store';

// GitHub repository to fetch languages from
const owner = 'JonathanAgarradoJCU';
const repo = 'dalandan-studio';

function createGitHubLanguagesStore() {
  const { subscribe, set, update } = writable({
    data: null,
    loading: true,
    error: null
  });

  async function fetchLanguages() {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      set({ data, loading: false, error: null });
    } catch (err) {
      set({ data: null, loading: false, error: err.message });
      console.error('Error fetching GitHub languages:', err);
    }
  }

  // Start fetching immediately when store is created
  fetchLanguages();

  return {
    subscribe,
    refetch: fetchLanguages
  };
}

export const githubLanguages = createGitHubLanguagesStore();
