# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Progressive Web App (PWA) currency converter with an integrated calculator. Built with React, TypeScript, and Vite. The app fetches exchange rates from a public API and caches them locally for offline use.

## Development Commands

```bash
# Start development server (accessible on local network)
npm start

# Build for production
npm run build

# Run tests with Vitest
npx vitest

# Run a specific test file
npx vitest src/screens/Main/Calculator/store/__tests__/reducer.test.ts

# Format code with Prettier
npm run format

# Lint and fix code
npm run lint

# Deploy to GitHub Pages
npm run deploy

# Preview production build
npm run preview
```

## Architecture

### State Management

The app uses React's `useReducer` with LocalStorage persistence:

- **App-level state** (`src/store/reducer.ts`): Manages global state including:

  - Favorite currencies list
  - Exchange rates and date
  - Active input side (left/right)
  - Selected currency codes
  - All state is automatically persisted to localStorage via the `Storage` class

- **Calculator state** (`src/screens/Main/Calculator/store/`): Isolated reducer pattern for calculator logic
  - Uses DecimalJS for precise arithmetic to avoid floating-point errors
  - Supports chained operations and repeat calculations
  - Located in `useCalculatorState.ts` and `reducer.ts`

### Storage Layer

The `Storage` class (`src/lib/LocalStorage.ts`) provides a typed localStorage wrapper:

- Automatic initialization with default values
- `get()`, `set()`, `update()`, and `clear()` methods
- Storage event watching for cross-tab sync
- All keys prefixed with `xc.` to avoid conflicts

Used by both:

- `appStorage` for app state (favorites, rates, selected currencies)
- `ratioStorage` for caching exchange rate responses by date

### API Integration

Exchange rates are fetched from `@fawazahmed0/currency-api` via CDN (`src/api/getUsdRatio.ts`):

- Rates are relative to USD as the base currency
- Responses cached by ISO date in localStorage
- Falls back to latest cached data if API request fails
- Currency conversion uses ratio calculation: `getRatio(from, to) = rates[from] / rates[to]`

### Screen Structure

- **Main Screen** (`src/screens/Main/`): Currency converter with dual inputs and calculator

  - Two currency inputs (left/right) with active state tracking
  - Real-time conversion using exchange rates
  - Calculator component syncs with active input
  - Swap button with rotation animation

- **Currencies Screen** (`src/screens/Currencies/`): Manage favorite currencies

  - Add/remove favorites
  - Drag-and-drop reordering (react-beautiful-dnd)

- **Settings Screen** (`src/screens/Settings/`): App settings and preferences

### CSS Modules

CSS Modules are configured with:

- Scoped class names: `[local]--[hash:4]`
- camelCase naming convention only
- Import as: `import classes from './Component.module.css'`

### Code Style

ESLint enforces:

- Consistent type imports (`import type { ... }`)
- Consistent type definitions (interfaces)
- Import ordering: external → internal → styles (alphabetized)
- Blank lines between block-like statements
- Strict React hooks rules

## Testing

Tests use Vitest with jsdom environment:

- Calculator reducer has comprehensive test coverage
- Tests are written in Russian (matching the app's primary language)
- Focus on edge cases: FP precision, division by zero, large numbers, negative numbers

## PWA Configuration

The app is configured as a PWA using `vite-plugin-pwa`:

- Service worker with auto-update
- App name: "iCurrency"
- Icons: 64px, 180px, 512px
- Theme color: #000000
- Caches all static assets (js, css, html, images, fonts)

## Decimal.js Configuration

DecimalJS is configured globally for calculator operations:

- `toExpNeg: -100` and `toExpPos: 100` for display range
- Prevents scientific notation for most common currency amounts
- Used throughout calculator reducer and currency conversion math
