import { writable } from 'svelte/store';

export const circlesMode = writable('hero'); // 'hero' or 'nav'
export const circlesAnimating = writable(false); // true when circles are animating (fade-in or fade-out)
export const artActiveSection = writable('Sections');
