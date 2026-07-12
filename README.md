# OptiBlue

Storefront público y panel administrativo de OptiBlue. El sitio permite consultar catálogo y sedes, solicitar reservas, cotizaciones y citas, y gestionar la operación desde un panel protegido.

Producción: [optiblue-prod.web.app](https://optiblue-prod.web.app)

## Estado real

- El frontend usa React Router con URLs públicas y rutas `/admin/*` separadas.
- Catálogo, categorías y sedes se leen directamente desde Firestore.
- Pedidos, citas y cotizaciones se registran mediante Cloud Functions antes de intentar abrir WhatsApp.
- Las escrituras administrativas pasan por Cloud Functions y requieren Firebase Auth con custom claim `admin: true`.
- El panel y Firebase Auth se cargan bajo demanda; las páginas públicas también están separadas por ruta.
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

# Pruebas unitarias
npm test

# Previsualización del contenido de dist/
npm run preview
```

`npm run lint` existe en `package.json`, pero actualmente no es ejecutable porque ESLint no está instalado como dependencia del repositorio.

La validación visual local del storefront se realiza con Firebase Emulator y Playwright en `390`, `768`, `1024` y `1440 px`; el runner usado durante el rediseño es temporal y no forma parte del producto.

## Arquitectura relevante

```text
src/
├── components/       Storefront, flujos públicos y panel administrativo
├── hooks/            Suscripciones de lectura a Firestore
├── lib/api/          Clientes de Cloud Functions
├── lib/auth/         Firebase Auth y autorización administrativa
├── lib/firestore.ts  Instancia pública de Firestore
├── styles/           Tokens y estilos compartidos
└── types/            Contratos TypeScript del modelo V1
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
