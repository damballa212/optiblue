# OptiBlue

Sitio web + panel administrativo para una óptica ficticia con presencia en tres ciudades de Venezuela (Caracas, Valencia, Maracaibo). Catálogo de monturas, cotizador de lentes graduados, agendamiento de citas y contacto por WhatsApp.

> ⚠️ **Estado: prototipo / mock.** No hay backend, base de datos ni autenticación real. Todo el estado (productos, citas, cotizaciones) vive en memoria del navegador (`useState`) y se pierde al recargar la página. Ver [Limitaciones conocidas](#limitaciones-conocidas-mock).

## Stack

- **React** 19.2.7
- **TypeScript** 7.0.2 (compilador nativo reescrito en Go — [ver anuncio oficial](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/))
- **Vite** 8.1.4

## Requisitos

- Node.js 20+
- npm

## Instalación y uso

```bash
npm install

# Desarrollo (http://localhost:5173)
npm run dev

# Type-check
npx tsc -b

# Build de producción → dist/
npm run build

# Previsualizar el build
npm run preview
```

## Estructura del proyecto

```
src/
├── types/            Interfaces y tipos compartidos (Producto, Sede, Cita, Cotizacion, ...)
├── data/              Datos mock tipados (productos, sedes, citas, cotizaciones, servicios)
├── lib/
│   └── whatsapp.ts    Construcción de mensajes y apertura de deep links a WhatsApp
├── styles/
│   ├── tokens.ts      Paleta de colores y radios — única fuente de verdad de diseño
│   └── shared.ts      Estilos reutilizados entre features (botones, cards, tablas, modal...)
├── components/
│   ├── layout/        NavBar, Footer
│   ├── home/          Hero + página de inicio
│   ├── catalogo/      Listado de productos, filtros, modal de reserva
│   ├── lentes/         Cotizador de lentes adaptados (wizard de 3 pasos)
│   ├── servicios/      Servicios oftalmológicos
│   ├── sedes/          Listado de sedes físicas
│   └── admin/          Panel administrativo (dashboard, CRUD de productos, citas, cotizaciones)
├── App.tsx            Enrutamiento manual entre páginas + modo admin
└── main.tsx           Punto de entrada
```

Cada componente de `components/` trae su propio `*.styles.ts` co-ubicado; los estilos verdaderamente compartidos entre features viven en `styles/shared.ts`, y todo color/radio sale de `styles/tokens.ts` — ningún valor hexadecimal está hardcodeado dentro de un componente.

## Funcionalidad actual

- **Catálogo**: filtro por categoría (monturas, lentes de sol, deporte), reserva por WhatsApp.
- **Lentes adaptados**: wizard de 3 pasos (montura + graduación → extras → sede y cotización), envía resumen por WhatsApp.
- **Servicios**: listado de servicios oftalmológicos, agenda por WhatsApp.
- **Sedes**: las 3 sedes con dirección, teléfono, horario y WhatsApp propio por sede.
- **Panel admin** (botón "⚙ Panel", sin login): dashboard con métricas, CRUD de productos, gestión de estado de citas y cotizaciones.

## Limitaciones conocidas (mock)

Esto sigue siendo un prototipo de UI/UX, no un producto en producción:

- **Sin persistencia**: los datos iniciales están en `src/data/*.ts`; cualquier cambio hecho desde el panel admin (crear/editar/eliminar producto, cambiar estado de cita, etc.) se pierde al recargar. No hay backend ni base de datos.
- **Sin autenticación**: el "Panel de administración" es accesible para cualquier visitante del sitio, sin login ni control de acceso.
- **Datos de contacto ficticios**: números de teléfono/WhatsApp, direcciones y el link de "Ver mapa" (`https://maps.google.com` genérico) son de ejemplo, no ubicaciones ni números reales.
- **Sin validación de formularios**: los inputs numéricos del admin (precio, stock) no validan formato ni rangos.
- **Sin router**: la navegación entre páginas es estado de React (`useState`), no hay URLs por página ni soporta atrás/adelante del navegador.

## Historial

Este proyecto se migró desde un único archivo `optiblue.jsx` (844 líneas, sin build tooling) a esta estructura modular tipada. Ver PR [#1](https://github.com/carlosvalero26/optiblue/pull/1) para el detalle de la migración y los bugs corregidos en el proceso.
