/**
 * Scroll utility functions for smooth section navigation
 * 
 * USAGE FOR FUTURE PAGES WITH SECTION NAVIGATION:
 * 
 * 1. Import the function: import { scrollToSection } from '../utils/scrollUtils.js';
 * 
 * 2. Create a handler function that accounts for any offset elements (like section toggle bars):
 *    function scrollToSectionHandler(id) {
 *      const extraOffset = yourToggleBarHeight || 0;
 *      scrollToSection(id, extraOffset); // uses default 300ms duration for quick smooth scroll
 *    }
 * 
 * 3. Call the handler from your navigation buttons:
 *    <button onclick={() => scrollToSectionHandler('section-id')}>Section Name</button>
 * 
 * The scroll duration defaults to 300ms for a quick but smooth animation.
 * Adjust by passing a custom duration: scrollToSection(id, extraOffset, 500);
 */

/**
 * Scroll to a section with proper offset for navbar
 * @param {string} id - The ID of the element to scroll to
 * @param {number} extraOffset - Extra offset to add (e.g., for sections toggle bar)
 * @param {number} duration - Scroll duration in milliseconds (default: 300ms for quick scroll)
 */
export function scrollToSection(id, extraOffset = 0, duration = 300) {
  const el = document.getElementById(id);
  if (!el) return;

  const scrollContainer = document.querySelector('.page-scroll-wrapper');
  const navWrapper = document.querySelector('.nav-wrapper');

  if (scrollContainer && navWrapper) {
    const navHeight = navWrapper.getBoundingClientRect().height;
    const offset = navHeight + extraOffset;
    const elPosition = el.offsetTop;
    const targetPosition = elPosition - offset;
    const startPosition = scrollContainer.scrollTop;
    const distance = targetPosition - startPosition;

    if (distance === 0) return;

    const startTime = performance.now();

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic function for smooth deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      scrollContainer.scrollTop = startPosition + distance * easeOutCubic;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
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
