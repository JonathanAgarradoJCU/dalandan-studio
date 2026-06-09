/**
 * Scroll to a section with proper offset for navbar
 * @param {string} id - The ID of the element to scroll to
 * @param {number} extraOffset - Extra offset to add (e.g., for sections toggle bar)
 */
export function scrollToSection(id, extraOffset = 0) {
  const el = document.getElementById(id);
  if (!el) return;

  const scrollContainer = document.querySelector('.page-scroll-wrapper');
  const navWrapper = document.querySelector('.nav-wrapper');

  if (scrollContainer && navWrapper) {
    const navHeight = navWrapper.getBoundingClientRect().height;
    const offset = navHeight + extraOffset;
    const elPosition = el.offsetTop;
    scrollContainer.scrollTo({
      top: elPosition - offset,
      behavior: 'smooth'
    });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Get the current navbar height
 * @returns {number} The navbar height in pixels
 */
export function getNavHeight() {
  const navWrapper = document.querySelector('.nav-wrapper');
  return navWrapper ? navWrapper.getBoundingClientRect().height : 0;
}

/**
 * Height of the sections toggle bar on mobile (in pixels)
 */
export const SECTIONS_TOGGLE_HEIGHT = 40;

/**
 * Height of the sections toggle bar on desktop (in pixels)
 */
export const SECTIONS_TOGGLE_HEIGHT_DESKTOP = 55;
