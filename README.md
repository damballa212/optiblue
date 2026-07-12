# OptiBlue

Storefront público y panel administrativo de OptiBlue. El sitio permite consultar catálogo y sedes, cotizar lentes con fórmula óptica, solicitar reservas y citas, y gestionar la operación desde un panel administrativo mobile-first protegido.

Producción: [optiblue-prod.web.app](https://optiblue-prod.web.app) · Backend: [`optiblue-backend`](https://github.com/damballa212/optiblue-backend)

## Estado real

- React Router con URLs públicas y rutas `/admin/*` (rutas reales, no estado de React — recargar cualquier sección del panel conserva la pantalla).
- Catálogo, categorías y sedes se leen directamente desde Firestore (`onSnapshot`, tiempo real).
- Pedidos, citas y cotizaciones se registran mediante Cloud Functions antes de intentar abrir WhatsApp.
- El total de una cotización lo calcula siempre el backend (producto real + configuración de precios administrable) — el frontend nunca lo decide ni lo envía. Ver `optiblue-backend/README.md`, sección "Integridad de precios".
- Las escrituras administrativas pasan por Cloud Functions y requieren Firebase Auth con custom claim `admin: true`.
- El panel admin es una "bandeja de trabajo operativa" mobile-first: `Hoy` (pendientes accionables), bottom nav en mobile / sidebar en desktop, cambio de estado con confirmación y **deshacer**, WhatsApp con mensaje editable, y mantenimiento de catálogo/sedes con validación y confirmación contextual de borrado (sin `window.confirm`/`alert`).
- El panel y Firebase Auth se cargan bajo demanda; las páginas públicas también están separadas por ruta (code splitting).
- El storefront público usa el sistema visual OptiBlue aprobado: Space Grotesk + DM Sans, navy/azul pastel/celeste, iconografía Lucide y fallbacks ópticos sin emojis.
- Reserva, cotización y solicitud de cita permiten continuar con nombre y teléfono; Google es solo un atajo opcional de autocompletado.
- Los datos reales de catálogo y sedes siguen incompletos. No se deben reemplazar con información inventada.

## Stack

- React 19
- TypeScript 7
- Vite 8
- React Router 7
- Firebase 12: Firestore, Authentication, Functions y Hosting

## Requisitos

- Node.js `^20.19.0` o `>=22.12.0`, según el engine requerido por Vite 8
- npm
- Backend `optiblue-backend` para ejecutar Functions y emuladores locales

## Desarrollo local

```bash
npm install
npm run dev
```

El frontend usa por defecto el proyecto local `demo-optiblue` y espera:

- Firestore Emulator en `127.0.0.1:8080`
- Auth Emulator en `127.0.0.1:9099`
- Cloud Functions en `127.0.0.1:5001`

Los emuladores y el seed se ejecutan desde el repositorio separado `optiblue-backend`.

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

## Comandos

```bash
# Servidor de desarrollo
npm run dev

# Type-check y build de producción
npm run build

# Pruebas unitarias (12 archivos, 38 tests)
npm test

# Lint
npm run lint

# Previsualización del contenido de dist/
npm run preview
```

`npm run lint` usa **oxlint** (Oxc/Rust), no ESLint. Este proyecto usa **TypeScript 7** (compilador nativo en Go), y `typescript-eslint` — incluido su último alpha — no lo soporta todavía: falla al importarse contra el compilador. `oxlint` no depende de `typescript-eslint` ni de `typescript` para nada, así que no choca. El chequeo de tipos real lo cubre `tsc -b` en `npm run build`.

La validación visual del storefront y del panel admin se hace con Firebase Emulator + Playwright en `390`, `768` y `1440 px` — sesiones puntuales, no hay una suite de Playwright versionada en el repo todavía.

## Arquitectura relevante

```text
src/
├── components/
│   ├── admin/          Panel administrativo (bandeja operativa, ver detalle abajo)
│   ├── catalogo/        Catálogo, filtros, detalle de producto
│   ├── lentes/           Cotizador con fórmula óptica (PageLentes)
│   ├── sedes/, servicios/, home/  Storefront público
│   └── shared/           Componentes reutilizables (modales, estados, WhatsApp)
├── hooks/               Suscripciones de lectura a Firestore + hooks de datos vía Function
├── lib/api/             Clientes de Cloud Functions (uno por módulo backend)
├── lib/auth/            Firebase Auth y autorización administrativa
├── lib/firestore.ts     Instancia pública de Firestore
├── styles/               Tokens y estilos compartidos del storefront
└── types/                Contratos TypeScript del modelo V1 (espejo de los schemas Zod del backend)
```

Estructura del panel admin (`src/components/admin/`):

```text
admin/
├── AdminRoutes.tsx     Rutas reales bajo /admin/* (login, hoy, pedidos, citas, cotizaciones, catalogo, sedes, mas)
├── AdminShell.tsx       Layout: sidebar desktop / bottom nav mobile, contadores de pendientes
├── data/                AdminOperationsContext: fuente única de datos del panel (pedidos/citas/cotizaciones/sedes/productos)
├── domain/               Lógica pura testeada: prioridad de "Hoy", filtros, validación de formularios, estado, mensajes de WhatsApp
├── pages/                Una página por sección (AdminTodayPage, AdminWorkPage genérica para pedido/cita/cotización, AdminCatalogPage, AdminLocationsPage, AdminMorePage)
└── ui/                   Piezas compartidas: detalle responsive, editor de estado con deshacer, composer de WhatsApp, confirmación de borrado, estados loading/error/empty
```

El storefront no importa Firebase Auth de forma estática. `apiRequest` solo carga Auth cuando una operación administrativa lo solicita explícitamente.

## Producción

Firebase Hosting sirve `dist/` y reescribe las rutas SPA hacia `index.html`. El proyecto configurado en `.firebaserc` es `optiblue-prod`.

Antes de desplegar:

```bash
npm run build
npm run preview
```

El despliegue no forma parte automática de este repositorio ni de `npm run build`.

## Pendientes V1

- Catálogo real del cliente: seguimiento en `MAR-103`.
- Direcciones, teléfonos, WhatsApp, horarios y Maps reales de las sedes: seguimiento en `MAR-104`.
- Structured data de productos se mantiene fuera hasta tener catálogo real completo.
- No se publican claims, ratings, políticas o promociones sin evidencia confirmada.
