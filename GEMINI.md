# Trading Hub

A modern, clean, professional web application for tracking economic events and performing quick calculations. Built as a high-performance static web app.

## Project Overview

-   **Purpose:** A centralized dashboard for traders to monitor key economic events (FOMC, CPI, NFP, PMI) and use a built-in calculator.
-   **Architecture:** Static Web App (Vue 3 + Vite).
-   **Design:** Material-inspired flat design with dark/light mode support, responsive grid, and red accent colors for events.

## Tech Stack

-   **Framework:** Vue 3 (Composition API)
-   **Styling:** Tailwind CSS v4
-   **Build Tool:** Vite
-   **Icons:** Custom SVG + Lucide-inspired designs
-   **Language:** JavaScript (ESM)

## Features

1.  **Economic Event Calendar:**
    -   Monthly view with navigation.
    -   Event highlighting (Red background).
    -   Detailed modal for daily events.
    -   Dynamic generation of NFP (1st Fri), CPI (2nd Wed), and PMI (1st business day) up to 2030.
    -   Static FOMC event data.
2.  **Professional Calculator:**
    -   Arithmetic operations.
    -   Keyboard support.
    -   Modern UI with subtle feedback.
3.  **Theming:**
    -   Full dark and light mode support.
    -   Persistence in `localStorage`.
    -   System preference detection.

---

## Building and Running

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
The output will be in the `dist/` directory, ready for static hosting (e.g., GitHub Pages).

---

## Development Conventions

-   **Components:** Logic-heavy components reside in `src/components/`.
-   **Data:** Static event data is in `src/data/fomc-events.json`.
-   **Utils:** Logic for dynamic event generation is in `src/utils/eventGenerator.js`.
-   **Styling:** Utility-first using Tailwind CSS v4. Custom theme extensions are in `src/style.css` using the `@theme` block.
-   **Reactivity:** Preference for Vue 3 `<script setup>` and Composition API.
