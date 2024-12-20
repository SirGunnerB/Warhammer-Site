# Styles Directory Structure

This directory contains all the CSS styles for the Warhammer 40,000 website. We follow the 7-1 pattern for CSS architecture.

## Directory Structure

- `base/` - Contains reset, typography, and other base styles
  - `_reset.css` - CSS reset/normalize
  - `_typography.css` - Typography rules
  - `_variables.css` - CSS variables and constants

- `components/` - Individual component styles
  - Navigation
  - Buttons
  - Cards
  - Forms
  - etc.

- `layouts/` - Layout-specific styles
  - Grid system
  - Header
  - Footer
  - Sidebar
  - etc.

- `themes/` - Theme-specific styles
  - Different faction color schemes
  - Dark/light modes
  - Special event themes

- `utils/` - Utilities and helper classes
  - Spacing helpers
  - Text utilities
  - Display utilities
  - etc.

- `pages/` - Page-specific styles
  - Home page
  - Planet pages
  - Character pages
  - etc.

## Usage

Import order in main.css:
1. Variables/Constants
2. Reset/Base styles
3. Typography
4. Layouts
5. Components
6. Utilities
7. Page-specific styles
8. Themes

## Naming Conventions

We follow BEM (Block Element Modifier) methodology:
- Block: `.block`
- Element: `.block__element`
- Modifier: `.block--modifier` or `.block__element--modifier`

## Color System

All colors are defined as CSS variables in `base/_variables.css`
