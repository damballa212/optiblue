# OptiBlue Storefront Redesign - Implementation Plan

Source spec: `docs/superpowers/specs/2026-07-11-optiblue-storefront-redesign-design.md`
Linear: MAR-109 + MAR-110

Status: implemented and verified locally on 2026-07-11. Real catalog/photos/location contacts remain external content dependencies in MAR-103/MAR-104/MAR-108; the V1 UI does not invent them.

## 1. Test and dependency foundation

- [x] Add Fontsource variable packages, Lucide React, Vitest, jsdom, and Testing Library.
- [x] Add `test` script and minimal Vitest configuration.
- [x] Write failing tests for catalog category/price/stock/featured filtering and sorting.
- [x] Implement pure catalog selection utilities until tests pass.

## 2. Visual foundation

- [x] Add global CSS reset, self-hosted fonts, focus rules, and CSS variables.
- [x] Expand typed tokens with approved palette, spacing, breakpoints, radii, shadows, and typography.
- [x] Create BrandMark, OpticalArtwork, ProductArtworkFallback, DataState, Modal, Sheet, and shared public form controls.
- [x] Preserve admin styling and Phase 5 code splitting.

## 3. Public layout

- [x] Replace NavBar with desktop links, mobile drawer, and accessible controls.
- [x] Add persistent mobile bottom navigation with safe-area handling.
- [x] Rebuild footer as institutional brand/navigation/location/contact structure.
- [x] Verify active routes, focus return, Escape, focus trap, and no public Admin link.

## 4. Complete approved Home

- [x] Implement pastel editorial Hero and optical artwork.
- [x] Implement QuickPaths, FeaturedProducts, ServiceProcess, LocationPreview, and AdviceBanner.
- [x] Use Firestore data only where specified and honest handling for missing sede values.
- [x] Add loading/error/empty variants and responsive composition matching approved mockup.

## 5. Complete approved Catalog

- [x] Implement desktop filter rail and mobile filter sheet.
- [x] Apply tested category, price, stock, featured, and sorting logic.
- [x] Rebuild product cards with real image/fallback and V1 fields only.
- [x] Implement `/catalogo/:productoId` detail surface with route/back behavior.
- [x] Implement availability, reserve, and quote actions without location-specific stock claims.

## 6. Conversion and remaining public surfaces

- [x] Rebuild reservation and appointment modals with shared accessible surface components.
- [x] Restyle quote flow, Services, and Locations to the approved visual system.
- [x] Add optional dynamically loaded Google name-prefill shortcut while keeping phone required.
- [x] Preserve backend-first registration and honest WhatsApp fallback behavior.
- [x] Remove all public emoji iconography and generic copy.

## 7. Verification and documentation

- [x] Run unit tests, TypeScript/Vite build, and `git diff --check`.
- [x] Run Firebase emulators and seed.
- [x] Smoke-test Home, Catalog, detail, Lenses, Services, Locations, reservation, quote, and appointment.
- [x] Capture 390px, 768px, 1024px, and 1440px screenshots.
- [x] Compare composition and hierarchy against all three approved mockups.
- [x] Check horizontal overflow, text clipping, focus, bottom navigation, sheets, and image/fallback cases.
- [x] Confirm public initial route still excludes admin/Auth-exclusive chunks unless Google is invoked.
- [x] Update Linear AC/verification, Obsidian project note, and daily at session close.
