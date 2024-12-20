# Scripts Directory Structure

This directory contains all JavaScript code for the Warhammer 40,000 website.

## Directory Structure

- `components/` - Reusable UI components
  - Navigation
  - Search
  - Timeline
  - Tooltips
  - etc.

- `utils/` - Utility functions and helpers
  - DOM manipulation
  - Data formatting
  - Event handling
  - etc.

- `maps/` - Galaxy map related code
  - Map initialization
  - Planet positioning
  - Travel routes
  - Zoom/pan controls
  - etc.

- `data/` - Data management and API interactions
  - Data fetching
  - Data transformation
  - Caching
  - etc.

## Code Organization

Each module should:
1. Have a single responsibility
2. Be well-documented with JSDoc comments
3. Use ES6+ features
4. Be thoroughly tested

## Naming Conventions

- Files: kebab-case (e.g., `galaxy-map.js`)
- Classes: PascalCase (e.g., `class PlanetMap`)
- Functions/variables: camelCase (e.g., `function initializeMap()`)
- Constants: UPPER_SNAKE_CASE (e.g., `const MAX_ZOOM_LEVEL`)

## Dependencies

List of external libraries and their purposes:
- Library 1: Purpose
- Library 2: Purpose
etc.
