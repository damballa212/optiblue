# OptiBlue Back Office Redesign - Plan de Implementacion

Fuente: `docs/superpowers/specs/2026-07-12-optiblue-backoffice-redesign-design.md`
Linear: MAR-113
Estado: pendiente de aprobacion para implementar
Complejidad: alta; rediseño transversal de rutas, estado, UI responsive y mutaciones administrativas

## Requisitos consolidados

- Convertir el home administrativo en una bandeja unica de pendientes.
- Priorizar citas pendientes por fecha/hora preferida y luego pedidos/cotizaciones por fecha reciente.
- Usar rutas administrativas reales y conservar la seccion al recargar.
- Mobile-first en 390 px con bottom nav de cinco destinos.
- Desktop con sidebar, listas densas y panel lateral de detalle.
- Agregar busqueda y filtros por estado/sede.
- Editar el mensaje antes de abrir WhatsApp al telefono del cliente.
- Separar contacto y cambio de estado.
- Mostrar saving, success, error, retry y deshacer.
- Rediseñar Productos, Categorias, Sedes y Login sin ampliar el backend.
- Eliminar emojis, selects de estado, tablas rotas y dialogos nativos.
- Aplicar el sistema neutral aprobado y validar 390, 768 y 1440 px.

## Arquitectura propuesta

### Rutas

```text
/admin/login
/admin                 -> redirect /admin/hoy
/admin/hoy
/admin/pedidos
/admin/citas
/admin/cotizaciones
/admin/catalogo
/admin/sedes
```

`AdminRoutes` conserva `AuthProvider` y `RequireAdmin`. El shell autenticado usa rutas hijas y `Outlet`; no mantiene una seccion duplicada en `useState`.

### Estado de datos

Crear `AdminOperationsProvider` dentro del shell autenticado para cargar una sola vez:

- Pedidos.
- Citas.
- Cotizaciones.
- Productos para resolver `productoId`.
- Sedes para resolver `sedeId`.

El provider expone arrays, loading/error por fuente y refetch por entidad. Categorias se cargan en Catalogo, donde se necesitan.

No se crea un store global nuevo ni se agrega una dependencia de estado. Context + hooks existentes son suficientes para V1.

### Modelos derivados

`AttentionItem` y metadata de estados son view models frontend. No se persisten ni se agregan a Firestore.

La UI deriva:

- Contadores accionables.
- Prioridad.
- Labels de sede/producto.
- Tono e icono del estado.
- Verbo de siguiente accion.

## Fase 0 - Baseline y pruebas de dominio

Objetivo: fijar las reglas de negocio visuales antes de crear componentes.

### Pruebas primero

- [ ] Ejecutar `npm run test` y `npm run build` sobre el HEAD actual y registrar baseline.
- [ ] Crear `src/components/admin/domain/attention.test.ts` con casos de pedidos, citas y cotizaciones accionables/no accionables.
- [ ] Probar orden de citas vencidas/proximas con `YYYY-MM-DD` + `HH:mm`.
- [ ] Probar fechas invalidas: permanecen visibles y van al final sin label relativo.
- [ ] Probar merge de pedidos/cotizaciones por fecha descendente.
- [ ] Crear pruebas de `normalizeAdminSearch` y filtros por texto, sede y estado.
- [ ] Crear pruebas de metadata semantica para todos los estados backend.

### Implementacion minima

- [ ] Crear `src/components/admin/domain/attention.ts`.
- [ ] Crear `src/components/admin/domain/filters.ts`.
- [ ] Crear `src/components/admin/domain/status.ts`.
- [ ] Usar parsing local defensivo para fecha/hora; no usar `new Date("YYYY-MM-DD")` con desplazamiento UTC implicito.
- [ ] Formatear fechas solo cuando el valor sea interpretable.
- [ ] Mantener fallback neutral para ids relacionados no resueltos.

### Criterio de salida

- [ ] Todas las reglas de cola, filtros y estados pasan como funciones puras.
- [ ] Ningun test depende de Firebase ni DOM.

## Fase 1 - Datos administrativos y rutas

Objetivo: crear una base estable sin cambiar aun el diseño de cada pantalla.

### Hooks

- [ ] Cambiar `refetch` de `usePedidos`, `useCitas` y `useCotizaciones` para devolver `Promise<void>`.
- [ ] Limpiar `error` al iniciar cada refetch.
- [ ] Evitar que una respuesta vieja sobrescriba una peticion mas reciente o un unmount.
- [ ] Crear `AdminOperationsContext.tsx` y `useAdminOperations()`.
- [ ] Exponer `refreshPedidos`, `refreshCitas`, `refreshCotizaciones` y `refreshAll`.
- [ ] Mantener `useProductos` y `useSedes` como `onSnapshot`; no agregar polling.
- [ ] No etiquetar ninguna fuente como realtime salvo las colecciones que realmente usan `onSnapshot`.

### Router

- [ ] Reescribir `AdminRoutes.tsx` con layout protegido y rutas hijas.
- [ ] Redirigir `/admin` a `/admin/hoy`.
- [ ] Actualizar `AdminLogin` para navegar a `/admin/hoy`.
- [ ] Crear placeholders temporales de ruta solo durante la fase, eliminados antes del cierre.
- [ ] Agregar pruebas de rutas protegidas y redirect de indice.
- [ ] Verificar que el chunk administrativo siga lazy y no entre al bundle publico inicial.

### Archivos principales

```text
src/components/admin/AdminRoutes.tsx
src/components/admin/data/AdminOperationsContext.tsx
src/hooks/usePedidos.ts
src/hooks/useCitas.ts
src/hooks/useCotizaciones.ts
src/pages/AdminLogin.tsx
```

### Criterio de salida

- [ ] Recargar cualquier ruta administrativa conserva la seccion.
- [ ] Login y custom claim admin mantienen el comportamiento actual.
- [ ] No hay peticiones duplicadas causadas por sidebar, badges y pagina activa.

## Fase 2 - Sistema visual y shell responsive

Objetivo: implementar la direccion aprobada antes de migrar contenido.

### Tokens

- [ ] Añadir tokens administrativos neutrales a `global.css` sin romper el storefront.
- [ ] Mantener navy, azul y celeste de marca existentes.
- [ ] Definir tonos pequenos para attention/progress/resolved/closed.
- [ ] Reservar rojo para error/borrado y verde para WhatsApp.
- [ ] Añadir `font-variant-numeric: tabular-nums` a numeros operativos.

### Shell

- [ ] Crear `AdminShell.tsx` y `AdminShell.module.css`.
- [ ] Crear `AdminHeader` compacto.
- [ ] Crear `DesktopSidebar` con `NavLink`, iconos Lucide y contadores.
- [ ] Crear `MobileBottomNav` con cinco items, badges y safe area.
- [ ] Crear `AdminMorePage` con Catalogo, Sedes, Ver sitio y Cerrar sesion.
- [ ] Garantizar layout de tres filas en mobile: header / contenido scrollable / bottom nav.
- [ ] Usar sidebar desde el breakpoint desktop; tablet conserva navegacion inferior si el ancho no sostiene sidebar + contenido.
- [ ] Añadir `aria-current`, labels accesibles y tooltips donde aplique.
- [ ] Eliminar `Admin.styles.ts` y estilos inline del shell cuando la migracion termine.

### Feedback compartido

- [ ] Crear `AdminDataState` con variantes loading, empty y error recuperable.
- [ ] Skeletons deben copiar la forma de filas, no cards del storefront.
- [ ] Error usa superficie neutral con acento rojo estrecho.
- [ ] Crear `AdminToastRegion` con `aria-live="polite"`.
- [ ] Crear `ConfirmDialog` accesible sin `window.confirm()`.
- [ ] Reutilizar la logica de focus trap/retorno de foco de `ModalSurface` cuando sea compatible; no duplicarla sin necesidad.

### Criterio de salida

- [ ] Shell coincide con mockups en 390 y 1440 px.
- [ ] No existe overflow horizontal ni superposicion de nav.
- [ ] Cero emojis en shell y estados compartidos.

## Fase 3 - Hoy y listas operativas

Objetivo: entregar la experiencia principal de lectura y priorizacion.

### Hoy

- [ ] Crear `AdminTodayPage`.
- [ ] Derivar contadores de pedidos/citas/cotizaciones pendientes.
- [ ] Renderizar una sola cola con `AttentionRow`.
- [ ] Mostrar proxima accion mediante texto, no color decorativo.
- [ ] Crear boton Actualizar que ejecuta `refreshAll` y expone error parcial por fuente.
- [ ] Si una fuente falla, conservar y mostrar las otras; no convertir toda la pantalla en error total.
- [ ] Empty: "No hay elementos pendientes" con accesos a secciones, sin claim de operacion terminada para siempre.

### Paginas de trabajo

- [ ] Crear `AdminOrdersPage`, `AdminAppointmentsPage` y `AdminQuotesPage` sobre un `WorkListPage` compartido.
- [ ] Crear toolbar con busqueda y boton de filtros.
- [ ] Crear `WorkListFilters` como bottom sheet en mobile y controles compactos en desktop.
- [ ] Mobile: filas escaneables con cliente, contexto, sede/fecha y estado.
- [ ] Desktop: tabla densa con columnas configuradas por entidad.
- [ ] Ocultar columnas secundarias antes de provocar overflow; detalle conserva toda la informacion.
- [ ] Empty por filtros ofrece Limpiar filtros.
- [ ] Error conserva datos anteriores cuando existan y ofrece Reintentar.

### Criterio de salida

- [ ] En 390 px se identifica el siguiente pendiente sin scroll horizontal.
- [ ] Search encuentra nombre y telefono con normalizacion consistente.
- [ ] Filtros de estado y sede pueden combinarse y limpiarse.
- [ ] Badges de nav coinciden con la cola accionable.

## Fase 4 - Detalle, WhatsApp y estados

Objetivo: completar el flujo reactivo end-to-end.

### Superficie de detalle

- [ ] Crear `ResponsiveDetailSurface`.
- [ ] Mobile: bottom sheet con maximo de alto, body scrollable y footer fijo interno.
- [ ] Desktop: panel lateral integrado al layout, no modal centrado.
- [ ] Gestionar Escape, backdrop mobile, focus inicial, trap y retorno de foco.
- [ ] Crear `OrderDetail`, `AppointmentDetail` y `QuoteDetail` con campos exactos.
- [ ] Mostrar "Producto no disponible" o "Sede no disponible" si falla la relacion.

### WhatsApp

- [ ] Crear `buildAdminWhatsAppMessage` como funcion pura por entidad.
- [ ] Probar mensajes de pedido, cita y cotizacion con datos faltantes permitidos.
- [ ] Crear `WhatsAppComposer` con telefono destino y textarea editable.
- [ ] Normalizar `entity.telefono` con el helper existente antes de habilitar la accion.
- [ ] Llamar `openWA(encodeURIComponent(message), entity.telefono)`.
- [ ] No usar el WhatsApp de la sede como destino del admin.
- [ ] No mutar estado al abrir WhatsApp.
- [ ] Si el telefono no es utilizable, deshabilitar accion y explicar el problema.

### Cambio de estado

- [ ] Crear `useAdminStatusMutation` con union discriminada por tipo.
- [ ] Exponer `idle | saving | success | error` y error visible.
- [ ] Crear `StatusEditor` con opciones explicitas, no `<select>`.
- [ ] Guardar mediante el API existente y refetch de la entidad correspondiente.
- [ ] Mostrar toast de exito con estado nuevo.
- [ ] Implementar Deshacer como segundo PATCH al estado anterior.
- [ ] Si Deshacer falla, informar y conservar el estado confirmado por servidor.
- [ ] Prevenir doble submit y cambios concurrentes del mismo item.

### Pruebas

- [ ] Test: abrir WhatsApp no llama API de estado.
- [ ] Test: el numero destino es el del cliente.
- [ ] Test: success actualiza lista/contador.
- [ ] Test: error mantiene detalle y ofrece Reintentar.
- [ ] Test: Deshacer llama API con estado anterior.

### Criterio de salida

- [ ] Flujo Hoy -> detalle -> WhatsApp -> estado -> Deshacer funciona con una mano en 390 px.
- [ ] Todos los estados backend son seleccionables y semanticamente correctos.

## Fase 5 - Catalogo, Categorias y Sedes

Objetivo: migrar mantenimiento ocasional con validacion y feedback completos.

### Validadores puros

- [ ] Crear `adminFormValidation.test.ts` antes de formularios.
- [ ] Producto: nombre/categoria requeridos, precio no negativo, stock entero no negativo, `imagenUrl` vacia o URL HTTP(S).
- [ ] Categoria: key/label requeridos y orden entero no negativo.
- [ ] Sede: todos los campos requeridos y Maps como URL HTTP(S).
- [ ] No precargar horarios, Maps ni contenido comercial inventado en formularios nuevos.

### Catalogo

- [ ] Crear `AdminCatalogPage` con tabs Productos/Categorias.
- [ ] Rehacer lista de productos con miniatura/fallback, categoria, precio, stock y destacado.
- [ ] Crear `ProductEditor` con errores por campo y foco al primer error.
- [ ] Añadir preview en vivo de `imagenUrl` y estado local de imagen invalida.
- [ ] Convertir URL vacia a `null` antes de llamar API.
- [ ] Crear `CategoryManager` usando CRUD ya existente.
- [ ] Mostrar cantidad de productos que usan una categoria antes de borrarla.
- [ ] Reemplazar confirm nativo por `ConfirmDialog` contextual.
- [ ] Mostrar loading/error/empty de productos y categorias por separado.

### Sedes

- [ ] Rehacer `AdminLocationsPage` con lista mobile y tabla/lista desktop.
- [ ] Crear `LocationEditor` con los seis campos reales.
- [ ] Eliminar valores default inventados del formulario vacio.
- [ ] Mantener accion de prueba de WhatsApp solo si usa el numero cargado y se etiqueta claramente.
- [ ] Reemplazar confirm nativo por dialogo con nombre de sede.
- [ ] Mostrar loading/error/empty del hook actual.
- [ ] No hardcodear tres documentos: renderizar lo que Firestore devuelve.

### Criterio de salida

- [ ] CRUD de producto, categoria y sede funciona con datos validos.
- [ ] Datos invalidos no llaman API y conservan el formulario.
- [ ] Ningun borrado usa dialogo nativo.
- [ ] No aparecen emoji fallbacks.

## Fase 6 - Login, limpieza y consistencia

Objetivo: cerrar todas las superficies y retirar el admin anterior.

### Login

- [ ] Migrar `AdminLogin.styles.ts` a `AdminLogin.module.css`.
- [ ] Eliminar gradiente, emoji y estilos inline.
- [ ] Mantener correo, contraseña, autocomplete y error generico actual.
- [ ] Mantener ausencia de registro y recuperacion.
- [ ] Mostrar loading sin revelar existencia del correo.
- [ ] Usar marca OptiBlue existente o mark geometrico aprobado sin redibujar el logo desde screenshot.

### Limpieza

- [ ] Retirar `AdminPanel`, `AdminDash` y vistas antiguas una vez reemplazadas.
- [ ] Retirar `Admin.styles.ts`, `AdminProductos.styles.ts` y imports sin uso.
- [ ] Eliminar imports admin de `src/styles/shared.ts` que ya no correspondan.
- [ ] Buscar emojis en `src/components/admin`, `src/pages/AdminLogin.tsx` y labels administrativos.
- [ ] Buscar `window.confirm`, `window.alert` y `<select>` de estados.
- [ ] Verificar que el storefront no cambie visual ni funcionalmente.

### Criterio de salida

- [ ] No queda arquitectura doble ni componentes legacy activos.
- [ ] Login y panel comparten tokens, tipografia e iconografia aprobados.

## Fase 7 - Verificacion integral

Objetivo: demostrar comportamiento, responsive y seguridad antes de deploy.

### Automatizacion

- [ ] Ejecutar `npm run test`.
- [ ] Ejecutar `npm run build`.
- [ ] Ejecutar `git diff --check`.
- [ ] Ejecutar `npm audit` sin exponer secretos.
- [ ] Añadir Playwright local/config si no existe para pruebas E2E repetibles.
- [ ] Ejecutar el frontend con emuladores Firebase y datos seed controlados.

### E2E

- [ ] Login valido e invalido.
- [ ] Recarga directa en cada ruta admin.
- [ ] Hoy -> detalle -> WhatsApp mock -> cambiar estado -> Deshacer.
- [ ] Search y filtros en las tres secciones.
- [ ] Crear, editar y borrar producto.
- [ ] Crear, editar y borrar categoria.
- [ ] Crear, editar y borrar sede.
- [ ] Loading, empty, error parcial y error de mutacion.

### Responsive visual

- [ ] Capturar 390 x 844.
- [ ] Capturar 768 x 1024.
- [ ] Capturar 1440 x 900.
- [ ] Comprobar `scrollWidth === clientWidth` en cada ruta.
- [ ] Comprobar que bottom nav no tapa la ultima fila ni footers de formularios.
- [ ] Comprobar teclado movil en formularios con viewport reducido.
- [ ] Comprobar textos largos, nombres extensos y numeros de badges de dos digitos.
- [ ] Comparar contra los cinco mockups aprobados.

### Accesibilidad

- [ ] Navegacion completa por teclado.
- [ ] Focus visible y retorno de foco en dialogos/sheets.
- [ ] Lectura de estados sin depender de color.
- [ ] `aria-live` no duplica anuncios.
- [ ] Targets tactiles de 44 px.
- [ ] Reduced motion respetado.

### Produccion

- [ ] Verificar manualmente contra backend real sin editar registros sensibles de forma destructiva.
- [ ] Confirmar que Auth sigue exigiendo custom claim admin.
- [ ] Confirmar que el bundle publico no carga Auth/admin anticipadamente.
- [ ] Actualizar checkboxes de MAR-113 solo con evidencia.
- [ ] Registrar commit/deploy en Linear y Obsidian.

## Dependencias

- Backend actual de pedidos, citas, cotizaciones, catalogo y sedes.
- Firebase Auth y custom claim `admin:true` existentes.
- Datos reales que Firestore tenga cargados; el UI debe manejar colecciones incompletas.
- `lucide-react`, CSS Modules, Vitest y Testing Library ya instalados.
- Playwright puede requerir una dependencia de desarrollo nueva para E2E repetible.

No se espera modificar `optiblue-backend` para este rediseño.

## Riesgos y mitigaciones

### Alto - Duplicacion de fetches

Riesgo: sidebar, Hoy y pagina activa montan hooks separados.

Mitigacion: `AdminOperationsProvider` unico dentro del shell y selectores derivados memoizados.

### Alto - Fechas con semantica y formato distintos

Riesgo: `fecha` es string sin validacion backend; citas y operaciones no significan lo mismo.

Mitigacion: parsers separados, tests de formato/invalido y cero tiempo relativo inventado.

### Alto - Undo sin historial

Riesgo: otro cambio puede ocurrir antes del PATCH de deshacer.

Mitigacion: ventana corta, bloqueo por item, refetch posterior y mensaje honesto si el servidor rechaza.

### Medio - Referencias eliminadas

Riesgo: producto/sede borrado deja ids historicos sin resolver.

Mitigacion: fallback textual estable en detalle y confirmacion contextual antes de borrar.

### Medio - Responsive de detalle y teclado

Riesgo: footer fijo del sheet tapa campos o teclado.

Mitigacion: grid de tres filas, body scrollable, `dvh`, safe area y pruebas con viewport reducido.

### Medio - Regresion del storefront

Riesgo: tokens o componentes compartidos cambian UI publica.

Mitigacion: variables admin con namespace cuando difieran, screenshot smoke del storefront y mantener lazy chunk.

### Bajo - Color semantico excesivo

Riesgo: reintroducir badges multicolor por cada estado.

Mitigacion: metadata central con solo attention/progress/resolved/closed y revision visual contra sistema V2.

## Orden de commits recomendado

1. `test: cubrir prioridad y filtros del backoffice`
2. `refactor: preparar datos y rutas del admin`
3. `feat: implementar shell responsive del backoffice`
4. `feat: implementar bandeja y listas operativas`
5. `feat: implementar detalle whatsapp y estados`
6. `feat: redisenar mantenimiento administrativo`
7. `feat: completar login y retirar admin legacy`
8. `test: verificar flujos responsive del backoffice`

Cada commit debe mantener `npm run test` y `npm run build` verdes. No mezclar cambios del storefront o pricing que no sean necesarios para MAR-113.

## Definicion de terminado

- [ ] Todos los Acceptance Criteria de MAR-113 estan verificados y sincronizados.
- [ ] Todos los checkboxes de este plan estan completos o documentados honestamente.
- [ ] No hay cambios backend ni claims nuevos ocultos dentro del rediseño.
- [ ] Tests, build, audit y E2E responsive pasan.
- [ ] Mockups aprobados y produccion coinciden en jerarquia, flujo y color funcional.
- [ ] Deploy de Firebase Hosting verificado en mobile y desktop.
- [ ] Obsidian y daily registran decisiones y resultados, no una copia de Linear.

## Puerta de ejecucion

No comenzar implementacion hasta recibir confirmacion explicita sobre este plan.
