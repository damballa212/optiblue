# OptiBlue Storefront Redesign - Design Specification

Date: 2026-07-11
Status: implemented and verified locally
Scope: combined UX/UI phases 2 and 3, including visual treatment of existing public conversion flows
Linear: MAR-109, MAR-110

## Objective

Replace the current generic storefront with the complete approved Direction A: an editorial-commercial optical identity that combines social energy with clinical precision. The implementation must reproduce the approved mockups across Home, public navigation, catalog, product detail, footer, and conversion surfaces.

This is not a color refresh. It is a structural redesign of the public React UI while preserving the current Firebase data model and working backend flows.

## Approved Visual References

The implementation source of truth is the approved visual companion session:

- `.superpowers/brainstorm/72742-1783826001/content/home-architecture-a.html`
- `.superpowers/brainstorm/72742-1783826001/content/visual-system-a.html`
- `.superpowers/brainstorm/72742-1783826001/content/catalog-conversion-a.html`

The user explicitly approved:

- Direction A, Editorial Commercial.
- Complete Home architecture for desktop and mobile.
- Complete visual system and component families.
- Catalog, product detail, filtering, and conversion flows.
- Combined implementation of phases 2 and 3.

## Brand Direction

OptiBlue must read as a real Venezuelan optical and ophthalmology business with strong social presence, local service, and clinical credibility. The interface must feel commercial and energetic without becoming a noisy Instagram grid.

The memorable device is an optical composition built from circles, rings, arcs, and frame-like geometry. It acts as the honest image fallback until real photography is available. It must be intentional artwork, never an empty placeholder.

No stock photography is allowed. Real product images from `imagenUrl` take precedence when available. No photo of a store, employee, service, or location may appear unless supplied by the client.

## Visual System

### Color tokens

Core palette:

- `brand.navy`: `#002D63`, authority, navigation, dark cards, and institutional surfaces.
- `brand.navyStrong`: `#003B7A`, optical artwork and selected emphasis.
- `brand.pastel`: `#D7EEF3`, principal commercial field.
- `brand.pastelStrong`: `#CFE5EC`, alternate field and artwork layers.
- `brand.action`: `#174EDC`, accessible CTA blue adjusted from the Instagram royal blue range.
- `brand.sky`: `#54BFE8`, focus rings, icons, borders, and optical details.
- `neutral.ink`: `#071D35`, body contrast where navy is too saturated.
- `neutral.canvas`: `#F5F8F9`, page background.
- `neutral.white`: `#FFFFFF`, controlled surface color.

Existing semantic success, warning, and error colors remain available but must be checked for contrast against the new surfaces.

No full-screen generic blue gradient is permitted. Subtle tonal treatment inside optical artwork is acceptable only when it does not become the page background.

### Typography

- Display and headings: Space Grotesk, weights 600 and 700.
- Body and UI: DM Sans, weights 400 through 700.
- Fonts are self-hosted through Fontsource packages to avoid render dependence on Google Fonts.
- Display scale: 56/54 desktop, 42/42 tablet, 34/34 mobile.
- H2 scale: 32/34 desktop, 28/31 tablet, 25/29 mobile.
- H3: 20/24 desktop and 18/22 mobile.
- Body: 16/26 primary and 14/22 compact UI.
- Label: 12/12 uppercase with positive letter spacing.
- Font sizes must change at explicit breakpoints, not with viewport-width interpolation.

### Shape and elevation

- Buttons and inputs: 3-4px radius.
- Product, service, location, and modal surfaces: 4-6px radius.
- Circular controls are reserved for icon-only actions and optical artwork.
- Pills are not a default container pattern.
- Shadows are reserved for overlays, drawers, active cards, and deliberate hover lift.
- Cards use borders and layout contrast before shadows.
- Hover changes position, border, or shadow with a clear physical response; opacity-only hover is insufficient.
- Focus uses a visible sky-blue ring on both white and navy surfaces.

### Iconography

- Use `lucide-react` exclusively for interface icons.
- Default stroke width is 1.75 or 2, kept consistent by component family.
- No emoji may remain in public navigation, cards, services, buttons, fallback art, footer, or modals.
- The logo area uses a typographic OptiBlue wordmark and optical mark until a verified source logo asset is supplied. Do not redraw the supplied logo inaccurately from screenshots.

## Styling Architecture

The public storefront migrates from inline `CSSProperties` to CSS Modules because the approved design requires media queries, hover, focus-visible, active states, reduced-motion behavior, and keyframe skeletons.

Admin components remain on their current styling approach unless a shared public component requires a compatible token update. The redesign must not expand into an admin redesign.

Structure:

- `src/styles/tokens.ts`: typed design constants needed by TypeScript.
- `src/styles/global.css`: Fontsource imports, reset, body, focus defaults, and reusable layout primitives only.
- `*.module.css`: component-level responsive and interaction styling.
- Avoid generic utility class accumulation and avoid a new component framework.

## Public Layout

### Desktop and tablet navigation

- White navigation field with typographic brand at the left.
- Real links to Catalog, Lenses, Services, and Locations.
- A single navy or action-blue assistance CTA at the right.
- Sticky behavior is allowed if it does not cover content or cause layout shift.
- Admin remains absent from public navigation.

### Mobile navigation

- Compact brand bar with icon menu button.
- Menu opens as an accessible drawer or bottom sheet with focus management and Escape support.
- Persistent mobile bottom navigation contains Home, Catalog, Quote, and Locations.
- Every target is at least 44px.
- Active route is communicated by icon, color, and accessible text.
- The bottom navigation respects safe-area insets and does not obscure forms or footer content.

## Home

The Home must implement the complete approved order:

1. Editorial hero.
2. Three quick paths.
3. Featured products.
4. Clinical/service process band.
5. Three real city locations.
6. Advice CTA.
7. Institutional footer.

### Hero

- Pastel field, not gradient.
- Left-aligned copy and asymmetric optical artwork.
- Concrete headline: monturas, adapted lenses, and visual attention. No generic vision slogan.
- Body names only Barinas, Acarigua, and Barquisimeto.
- Primary CTA opens Catalog; secondary CTA opens the existing quote flow.
- Artwork reserves the right side on desktop and becomes partially cropped on mobile.
- The first viewport must reveal the next quick-path section.

### Quick paths

Three direct actions:

- Choose a frame.
- Quote with a prescription.
- Request an appointment.

Each uses a Lucide icon, short supporting copy, and route or modal behavior backed by current flows.

### Featured products

- Uses `destacado === true` from Firestore.
- Real `imagenUrl` renders with stable ratio and lazy loading below the fold.
- Missing `imagenUrl` uses the approved optical frame artwork.
- Loading uses product skeletons.
- Error offers retry or Catalog navigation.
- Empty state explains that featured products are pending and offers Catalog.

### Services and process

- Navy band separates the clinical layer from the commercial sections.
- Service content may only use currently verified data.
- Static prices or clinical claims must not be introduced by the redesign.
- The process communicates: consult options, register data, choose location, continue through WhatsApp.

### Locations

- Exactly Barinas, Acarigua, and Barquisimeto when returned by Firestore.
- Each location uses `ciudad`, `direccion`, `horario`, `telefono`, `whatsapp`, and `maps` only.
- Missing or `Por definir` values are hidden or described honestly; they are never replaced by invented content.
- No location photo is expected by the component.

### Advice CTA and footer

- Advice sends the user toward the existing WhatsApp/location path.
- Footer is institutional, dark navy, and structured as brand, navigation, locations, and contact.
- Dynamic year remains.
- No fake guarantee, rating, history, brand, or promotion appears.

## Catalog

### Supported filters

Only these filters are allowed:

- Category from the ordered Firestore category collection.
- Price range derived from current product prices.
- In stock from `stock > 0`.
- Featured from `destacado === true`.

Sorting may include relevance/default order, price ascending, and price descending. No brand, color, material, shape, size, gender, or location availability filter is allowed.

### Responsive filtering

- Desktop uses a fixed-width left filter rail and result grid.
- Tablet may use a compact filter rail or sheet depending on measured space.
- Mobile uses a filter bottom sheet with selected-filter count, clear action, Cancel, and View Results.
- Selected filters appear as removable chips, but pills must remain functional rather than decorative.
- Filter state remains local to the page in V1. Filter query synchronization is not part of this implementation.

### Product cards

Cards show:

- Primary image or approved optical fallback.
- Featured signal when true.
- Category label.
- Name.
- Short description.
- Price.
- Honest stock signal.
- View Product command.

Cards must not expose reserve as the only action before the user sees product details.

### Product detail

Implement with the explicit route `/catalogo/:productoId`. The route renders as a modal or drawer on desktop and a full-height sheet on mobile. Closing returns to `/catalogo`, and browser back closes the detail when the user arrived from the catalog.

Detail contains only:

- One `imagenUrl` or optical fallback.
- Category.
- Name.
- Full description.
- Price.
- Stock and featured state.

Actions:

- Apartar en sede: opens the existing order flow.
- Cotizar con mi fórmula: opens or routes to the existing quote flow with product selected when supported.
- Consultar disponibilidad: prepares the verified WhatsApp/contact path without claiming location-specific inventory.

## Conversion Flows

Reservation, quote, and appointment keep their current backend-first behavior:

1. Explain why name and phone are requested.
2. Collect required fields.
3. Register the record through the existing Cloud Function.
4. Open WhatsApp only when a valid number exists.
5. Always show a clear registered confirmation.

Appointment copy uses `solicitar cita`, `fecha preferida`, and `hora preferida`. It never implies a confirmed slot.

### Optional Google shortcut

Google is optional and never gates the form. It prefills the available display name but cannot replace the required phone field. Firebase Auth and the Google provider are loaded dynamically only when the user invokes the shortcut so the public initial bundle remains isolated from Auth. A Google failure leaves the direct form usable and preserves existing input values.

### Modal and mobile behavior

- Desktop uses a bounded modal with a clear header, body, and action footer.
- Mobile uses a near-full-height sheet with safe-area padding.
- Focus enters the modal and returns to the trigger.
- Escape, overlay click, and close button work consistently.
- The mobile keyboard must not hide the primary action; actions may become sticky within the sheet.
- Errors remain inside the surface and preserve entered values.

## Shared Data States

- Loading: content-shaped skeletons, no generic spinner.
- Error: specific title, concise explanation, retry when possible, and an alternate route/contact action.
- Empty: explain what is absent and offer Catalog, Locations, or advice.
- Success: visible confirmation with record result and WhatsApp continuation state.
- All live regions use appropriate `aria-live` behavior without announcing decorative loading repeatedly.

## Component Boundaries

Proposed public component structure:

```text
components/
  brand/
    BrandMark
    OpticalArtwork
  layout/
    PublicHeader
    MobileNav
    MobileBottomNav
    Footer
  home/
    Hero
    QuickPaths
    FeaturedProducts
    ServiceProcess
    LocationPreview
    AdviceBanner
  catalogo/
    CatalogHeader
    CatalogFilters
    MobileFilterSheet
    ProductGrid
    ProductCard
    ProductArtworkFallback
    ProductDetail
  shared/
    Button
    IconButton
    Modal
    Sheet
    Field
    Skeleton
    DataState
    SuccessState
```

Components receive typed props and do not import unrelated feature hooks internally unless they own that data boundary. Existing business hooks and API clients remain the data source.

## Responsive Rules

Required verification widths:

- Mobile: 390px.
- Tablet: 768px.
- Desktop: 1440px.

Additional constraints:

- No horizontal document overflow.
- Hero artwork crops intentionally but never covers copy or actions.
- Product cards keep stable media ratios.
- Long product names and city data wrap without resizing controls.
- Bottom navigation and sheets account for safe areas.
- Reduced motion disables nonessential transforms and transitions.

## Verification

Implementation is complete only when:

- `npm run build` passes.
- `git diff --check` passes.
- Public source contains no emoji used as UI or fallback.
- Screenshots at 390px, 768px, and 1440px visually match the approved mockups in composition, hierarchy, palette, and component treatment.
- Canvas/pixel checks show nonblank pages and no incoherent overlap.
- Home, Catalog, Lenses, Services, Locations, product detail, reservation, quote, and appointment paths receive a smoke test.
- Firebase emulator tests confirm order, quote, and appointment records still register before WhatsApp.
- Product with image and product without image both render correctly.
- Empty, loading, and error states are exercised.
- Mobile menu, filter sheet, detail sheet, and conversion sheets pass keyboard/focus checks.
- Public initial route does not preload admin-exclusive code.

`npm run lint` is not a valid gate until ESLint is installed and configured in the repository; this remains documented rather than reported as passing.

Verified on 2026-07-11:

- Vitest: 4 files, 12 tests covering filter logic, WhatsApp copy, map/contact availability, and missing/broken product image fallbacks.
- Vite production build and `git diff --check` pass.
- Firebase emulators confirmed reservation, quote, and appointment registration without mandatory login.
- Playwright covered Home, Catalog, product detail, filter sheet, Lenses, Services, Locations, menu, reservation, quote, and appointment with no console errors or horizontal scrollers.
- Home screenshots were inspected at 390, 768, 1024, and 1440px; Catalog and remaining public surfaces were inspected on mobile and desktop.
- Empty catalog and empty category collections were exercised against Firestore Emulator, then the seed was restored.
- Real client photography/catalog/location contacts remain external dependencies and were not fabricated.

## Out of Scope

- Admin redesign.
- Multiple product images.
- Brand, color, material, size, frame shape, variants, or location-specific stock.
- Shopping cart or payment gateway.
- Virtual try-on.
- Real appointment availability.
- Cashea, promotions, ratings, guarantees, brand claims, or years-in-business claims without explicit verified content.
- Stock photography.
- Structured Product or LocalBusiness data until MAR-103 and MAR-104 are complete.
