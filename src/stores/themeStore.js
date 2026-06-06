import { writable } from 'svelte/store';

const THEME_KEY = 'dalandan-theme';

function createThemeStore() {
  const { subscribe, set, update } = writable('light');

  // Initialize from localStorage
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      set(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set(prefersDark ? 'dark' : 'light');
    }
  }

  return {
    subscribe,
    toggle: () => update(theme => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, newTheme);
      }
      return newTheme;
    }),
    set: (theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, theme);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();
