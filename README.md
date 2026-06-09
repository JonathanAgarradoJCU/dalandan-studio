# dalandan-studio

The official website and service portfolio for DalanDan Studio — showcasing creative furry art, music production/transcription, and web development.

## About

A modern, responsive personal portfolio website built with Svelte 5, featuring interactive elements and a clean design. The site showcases:

- **Art Gallery**: Browse past commissions and personal artwork with category filtering (all, commissions, sketches) and a lightbox viewer
- **Commission Tiers**: View pricing for headshots, half-body, and full-body commissions with detailed feature lists
- **Music**: Display of Spotify artist profile and music releases
- **Computer Stuff**: Interactive games including:
  - Snake Game with win condition (congratulations when board is filled)
  - Number Guessing Game with sound effects
  - GitHub language usage chart visualization
- **About Me**: Wiki-style biography with personal information and career highlights
- **Contact**: Contact information (work in progress)

## Features

- **Dark/Light Theme Toggle**: Switch between dark and light modes with persistent preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Animated Navigation**: Interactive navigation circles that animate between hero and navigation modes
- **Smooth Scrolling**: Automatic section detection and smooth scroll navigation on the Art page
- **Accessibility**: ARIA labels, keyboard navigation support, and proper alt text for images
- **Performance**: Lazy loading for images and optimized rendering

## Tech Stack

- **Framework**: Svelte 5 with Svelte SPA Router
- **Styling**: CSS with CSS variables for theming
- **Charts**: Chart.js for GitHub language visualization
- **State Management**: Svelte stores (circlesStore, themeStore, githubStore)

## Changelog

### June 9, 2026
- **11:49pm** - Refactored scroll logic by creating `src/utils/scrollUtils.js` to extract duplicate scroll functionality
- **11:49pm** - Removed unused `toggleArtSections` function from Navbar.svelte
- **11:50pm** - Fixed section detection on wide monitors where Terms of Service couldn't reach top threshold
- **11:56pm** - Fixed section title visibility when clicking section buttons on desktop by adding desktop sections toggle height offset

### June 8, 2026
- **8:13pm** - Reduced theme toggle and menu toggle button sizes on mobile/tablet devices (36px → 32px, font-size 1.5rem → 1.2rem)

### June 7, 2026
- **11:38pm** - Changed all "IT" and "IT Portfolio" references to "Computer" and "Computer Stuff" across the application
  - Updated route from `/it-portfolio` to `/computer-stuff`
  - Renamed `ITPortfolio.svelte` to `ComputerStuff.svelte`
  - Updated navigation labels and aria-labels
  - Updated color references in App.svelte
- **11:39pm** - Made navbar uniform size across all pages and devices
  - Set fixed height of 80px for navbar on desktop/tablet
  - Set fixed height of 70px for navbar on mobile
  - Adjusted logo sizes accordingly
- **11:39pm** - Centralized Home/About Me/Contact Me navigation buttons across all pages

### Earlier Changes
- Improve navbar toggle buttons styling and mobile layout
- Improve navbar toggle buttons styling and positioning
- Add dark/light theme toggle feature with darker backgrounds and wiki support
- Add win condition to snake game and update nav circles styling
- Add win condition to snake game - show congratulations when player fills entire board
- Merge Gallery into Art page and reorganize sections
- Fix snake game input delay - apply direction changes instantly and increase interpolation speed
- Further reduce arrow button click sound volume to 0.015
- Reduce arrow button click sound volume to 0.04
- Fix Svelte 5 linting issues and add click sound effects
- Change snake pattern to Orange, Orange, Macaroni, Blue repeating
- Refine AboutMe page text phrasing
