# OptiBlue

Storefront público y panel administrativo de OptiBlue. Consulta de catálogo y sedes, cotización de lentes con fórmula óptica, reservas y citas, y gestión operativa desde un panel mobile-first protegido.

**Producción**: [optiblue-prod.web.app](https://optiblue-prod.web.app) · **Backend**: [`optiblue-backend`](https://github.com/damballa212/optiblue-backend)

## Contenido

- [Quick start](#quick-start)
- [Stack](#stack)
- [Estado real](#estado-real)
- [Variables de entorno](#variables-de-entorno)
- [Comandos](#comandos)
- [Arquitectura](#arquitectura)
- [Producción](#producción)
- [Pendientes V1](#pendientes-v1)

## Quick start

Este frontend no funciona solo: necesita el backend (`optiblue-backend`) corriendo en paralelo para tener API y emuladores.

```bash
# 1. En optiblue-backend: levantar emuladores + sembrar datos (ver su README)
# 2. Acá:
npm install
npm run dev
```

Por defecto apunta al proyecto local `demo-optiblue` y espera:

- Firestore Emulator en `127.0.0.1:8080`
- Auth Emulator en `127.0.0.1:9099`
- Cloud Functions en `127.0.0.1:5001`

## Stack

- React 19
- TypeScript 7
- Vite 8
- React Router 7
- Firebase 12: Firestore, Authentication, Functions y Hosting

**Requisitos**: Node.js `^20.19.0` o `>=22.12.0` (engine de Vite 8), npm.

## Estado real

- React Router con URLs públicas y rutas `/admin/*` reales (no estado de React — recargar cualquier sección del panel conserva la pantalla).
- Catálogo, categorías y sedes se leen directamente desde Firestore (`onSnapshot`, tiempo real).
- Pedidos, citas y cotizaciones se registran mediante Cloud Functions antes de intentar abrir WhatsApp.
- El total de una cotización lo calcula siempre el backend (producto real + configuración de precios administrable) — el frontend nunca lo decide ni lo envía. Ver `optiblue-backend/README.md`, sección "Integridad de precios".
- Las escrituras administrativas pasan por Cloud Functions y requieren Firebase Auth con custom claim `admin: true`.
- El panel admin es una "bandeja de trabajo operativa" mobile-first: `Hoy` (pendientes accionables), bottom nav en mobile / sidebar en desktop, cambio de estado con confirmación y **deshacer**, WhatsApp con mensaje editable, y mantenimiento de catálogo/sedes con validación y confirmación contextual de borrado (sin `window.confirm`/`alert`).
- El panel y Firebase Auth se cargan bajo demanda; las páginas públicas también están separadas por ruta (code splitting).
- El storefront público usa el sistema visual OptiBlue aprobado: Space Grotesk + DM Sans, navy/azul pastel/celeste, iconografía Lucide y fallbacks ópticos sin emojis.
- Reserva, cotización y solicitud de cita permiten continuar con nombre y teléfono; Google es solo un atajo opcional de autocompletado.
- Los datos reales de catálogo y sedes siguen incompletos. No se deben reemplazar con información inventada.

## Variables de entorno

Producción requiere configurar estas variables sin guardar credenciales en Git:

```text
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FUNCTIONS_BASE_URL
VITE_SEDES_FUNCTIONS_BASE_URL
VITE_PEDIDOS_FUNCTIONS_BASE_URL
VITE_CITAS_FUNCTIONS_BASE_URL
VITE_COTIZACIONES_FUNCTIONS_BASE_URL
```

Sin `.env.production`, cada cliente de API cae a la URL del emulador local — por eso el desarrollo no requiere configurar nada de esto.

## Comandos

```bash
npm run dev        # servidor de desarrollo
npm run build      # type-check (tsc -b) + build de producción
npm test           # pruebas unitarias (12 archivos, 38 tests)
npm run lint       # oxlint
npm run preview    # previsualizar dist/
```

`npm run lint` usa **oxlint** (Oxc/Rust), no ESLint. Este proyecto usa **TypeScript 7** (compilador nativo en Go), y `typescript-eslint` — incluido su último alpha — no lo soporta todavía: falla al importarse contra el compilador. `oxlint` no depende de `typescript-eslint` ni de `typescript` para nada, así que no choca. El chequeo de tipos real lo cubre `tsc -b` en `npm run build`.

La validación visual del storefront y del panel admin se hace con Firebase Emulator + Playwright en `390`, `768` y `1440 px` — sesiones puntuales, no hay una suite de Playwright versionada en el repo todavía.

## Arquitectura

```text
src/
├── components/
│   ├── admin/           Panel administrativo (bandeja operativa, ver detalle abajo)
│   ├── catalogo/         Catálogo, filtros, detalle de producto
│   ├── lentes/            Cotizador con fórmula óptica (PageLentes)
│   ├── sedes/, servicios/, home/   Storefront público
│   └── shared/            Componentes reutilizables (modales, estados, WhatsApp)
├── hooks/                 Suscripciones de lectura a Firestore + hooks de datos vía Function
├── lib/api/               Clientes de Cloud Functions (uno por módulo backend)
├── lib/auth/              Firebase Auth y autorización administrativa
├── lib/firestore.ts       Instancia pública de Firestore
├── styles/                 Tokens y estilos compartidos del storefront
└── types/                  Contratos TypeScript del modelo V1 (espejo de los schemas Zod del backend)
```

Estructura del panel admin (`src/components/admin/`):

```text
admin/
├── AdminRoutes.tsx     Rutas reales bajo /admin/* (login, hoy, pedidos, citas, cotizaciones, catalogo, sedes, mas)
├── AdminShell.tsx       Layout: sidebar desktop / bottom nav mobile, contadores de pendientes
├── data/                 AdminOperationsContext: fuente única de datos del panel
├── domain/                Lógica pura testeada: prioridad de "Hoy", filtros, validación, estado, mensajes de WhatsApp
├── pages/                  Una página por sección (AdminTodayPage, AdminWorkPage genérica, AdminCatalogPage, AdminLocationsPage, AdminMorePage)
└── ui/                     Detalle responsive, editor de estado con deshacer, composer de WhatsApp, confirmación de borrado, estados loading/error/empty
```

El storefront no importa Firebase Auth de forma estática. `apiRequest` solo carga Auth cuando una operación administrativa lo solicita explícitamente.

## Producción

Firebase Hosting sirve `dist/` y reescribe las rutas SPA hacia `index.html`. El proyecto configurado en `.firebaserc` es `optiblue-prod`.

```bash
npm run build
npm run preview   # verificar antes de desplegar
firebase deploy --only hosting --project optiblue-prod
```

El deploy no es automático ni forma parte de `npm run build` — es un paso manual. Si un cambio depende de un endpoint nuevo del backend, desplegar el backend primero (ver `optiblue-backend/README.md`, sección "Deploy a producción").

## Pendientes V1

- Catálogo real del cliente: seguimiento en `MAR-103`.
- Direcciones, teléfonos, WhatsApp, horarios y Maps reales de las sedes: seguimiento en `MAR-104`.
- Structured data de productos se mantiene fuera hasta tener catálogo real completo.
- UI de administración de precios de cotización y completitud de sedes en el panel admin: Fases 5 y 6 de `docs/superpowers/plans/2026-07-12-optiblue-pricing-sedes-v1-implementation.md`.
- No se publican claims, ratings, políticas o promociones sin evidencia confirmada.
