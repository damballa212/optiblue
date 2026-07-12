# OptiBlue Back Office Redesign - Plan de Implementacion

Fuente: `docs/superpowers/specs/2026-07-12-optiblue-backoffice-redesign-design.md`
Linear: MAR-113
Estado: implementacion completada localmente; pendiente validacion autenticada y deploy
Complejidad: alta; rediseño transversal de rutas, estado, UI responsive y mutaciones administrativas

## Estado de ejecucion - 2026-07-12

- [x] Backoffice legacy reemplazado por shell responsive, cola unica, listas, detalle, WhatsApp, estados, mantenimiento y login.
- [x] Contrato de datos V1 conservado; no se modifico backend ni se agregaron campos.
- [x] `npm run test`: 37/37; `npm run build`; `git diff --check`; `npm audit`: 0 vulnerabilidades.
- [x] Validacion visual local en 390, 768 y 1440 px, sin overflow horizontal en las rutas principales.
- [x] Storefront smoke probado en build productivo y chunk `AdminRoutes-*` confirmado como lazy.
- [ ] E2E autenticado de mutaciones CRUD/estado/undo contra Firebase (requiere credenciales admin o emuladores con seed).
- [ ] Deploy de Firebase Hosting y smoke posterior (no solicitado ni ejecutado en esta sesion).
- [ ] `npm run lint`: el script existe, pero `eslint` no esta instalado en el repositorio.

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

- [x] Ejecutar `npm run test` y `npm run build` sobre el HEAD actual y registrar baseline.
- [x] Crear `src/components/admin/domain/attention.test.ts` con casos de pedidos, citas y cotizaciones accionables/no accionables.
- [x] Probar orden de citas vencidas/proximas con `YYYY-MM-DD` + `HH:mm`.
- [x] Probar fechas invalidas: permanecen visibles y van al final sin label relativo.
- [x] Probar merge de pedidos/cotizaciones por fecha descendente.
- [x] Crear pruebas de `normalizeAdminSearch` y filtros por texto, sede y estado.
- [x] Crear pruebas de metadata semantica para todos los estados backend.

### Implementacion minima

- [x] Crear `src/components/admin/domain/attention.ts`.
- [x] Crear `src/components/admin/domain/filters.ts`.
- [x] Crear `src/components/admin/domain/status.ts`.
- [x] Usar parsing local defensivo para fecha/hora; no usar `new Date("YYYY-MM-DD")` con desplazamiento UTC implicito.
- [x] Formatear fechas solo cuando el valor sea interpretable.
- [x] Mantener fallback neutral para ids relacionados no resueltos.

### Criterio de salida

- [x] Todas las reglas de cola, filtros y estados pasan como funciones puras.
- [x] Ningun test de dominio depende de Firebase ni DOM.

## Fase 1 - Datos administrativos y rutas

Objetivo: crear una base estable sin cambiar aun el diseño de cada pantalla.

### Hooks

- [x] Cambiar `refetch` de `usePedidos`, `useCitas` y `useCotizaciones` para devolver `Promise<void>`.
- [x] Limpiar `error` al iniciar cada refetch.
- [x] Evitar que una respuesta vieja sobrescriba una peticion mas reciente o un unmount mediante request id y guard de montaje.
- [x] Crear `AdminOperationsContext.tsx` y `useAdminOperations()`.
- [x] Exponer `refreshPedidos`, `refreshCitas`, `refreshCotizaciones` y `refreshAll`.
- [x] Mantener `useProductos` y `useSedes` como `onSnapshot`; no agregar polling.
- [x] No etiquetar ninguna fuente como realtime salvo las colecciones que realmente usan `onSnapshot`.

### Router

- [x] Reescribir `AdminRoutes.tsx` con layout protegido y rutas hijas.
- [x] Redirigir `/admin` a `/admin/hoy`.
- [x] Actualizar `AdminLogin` para navegar a `/admin/hoy`.
- [x] Crear placeholders temporales de ruta solo durante la fase, eliminados antes del cierre.
- [ ] Agregar pruebas automatizadas de rutas protegidas y redirect de indice; el redirect se verifico con Playwright local.
- [x] Verificar que el chunk administrativo siga lazy y no entre al bundle publico inicial.

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

- [x] Recargar cualquier ruta administrativa conserva la seccion por arquitectura de rutas; falta smoke con sesion autenticada real.
- [x] Login y custom claim admin mantienen el comportamiento actual en codigo; el guard sin sesion redirige a login.
- [x] No hay peticiones duplicadas causadas por sidebar, badges y pagina activa.

## Fase 2 - Sistema visual y shell responsive

Objetivo: implementar la direccion aprobada antes de migrar contenido.

### Tokens

- [x] Añadir tokens administrativos neutrales con scope en `AdminLayout.module.css` sin romper el storefront (se eligio scope local en vez de `global.css`).
- [x] Mantener navy, azul y celeste de marca existentes.
- [x] Definir tonos pequenos para attention/progress/resolved/closed.
- [x] Reservar rojo para error/borrado y verde para WhatsApp.
- [x] Añadir `font-variant-numeric: tabular-nums` a numeros operativos.

### Shell

- [x] Crear `AdminShell.tsx` y estilos CSS Module administrativos.
- [x] Crear `AdminHeader` compacto dentro del shell.
- [x] Crear `DesktopSidebar` con `NavLink`, iconos Lucide y contadores.
- [x] Crear `MobileBottomNav` con cinco items, badges y safe area.
- [x] Crear `AdminMorePage` con Catalogo, Sedes, Ver sitio y Cerrar sesion.
- [x] Garantizar layout de tres filas en mobile: header / contenido scrollable / bottom nav.
- [x] Usar sidebar desde el breakpoint desktop; tablet conserva navegacion inferior si el ancho no sostiene sidebar + contenido.
- [x] Añadir `aria-current`, labels accesibles y tooltips donde aplique.
- [x] Eliminar `Admin.styles.ts` y estilos inline del shell cuando la migracion termine.

### Feedback compartido

- [x] Crear `AdminDataState` con variantes loading, empty y error recuperable.
- [x] Skeletons deben copiar la forma de filas, no cards del storefront.
- [x] Error usa superficie neutral con acento rojo estrecho.
- [x] Anunciar confirmacion de estado con `aria-live="polite"` dentro del detalle (no se necesito region global).
- [x] Crear `ConfirmDialog` accesible sin `window.confirm()`.
- [x] Reutilizar `ModalSurface` y aplicar focus trap/retorno de foco en el panel lateral.

### Criterio de salida

- [x] Shell coincide con mockups en 390 y 1440 px.
- [x] No existe overflow horizontal ni superposicion de nav.
- [x] Cero emojis en shell y estados compartidos.

## Fase 3 - Hoy y listas operativas

Objetivo: entregar la experiencia principal de lectura y priorizacion.

### Hoy

- [x] Crear `AdminTodayPage`.
- [x] Derivar contadores de pedidos/citas/cotizaciones pendientes.
- [x] Renderizar una sola cola con filas de atencion.
- [x] Mostrar proxima accion mediante texto, no color decorativo.
- [x] Crear boton Actualizar que ejecuta `refreshAll` y expone error parcial por fuente.
- [x] Si una fuente falla, conservar y mostrar las otras; no convertir toda la pantalla en error total.
- [x] Empty: "No hay elementos pendientes" sin claim de operacion terminada para siempre.

### Paginas de trabajo

- [x] Crear las tres secciones sobre `AdminWorkPage` compartido y tipado por entidad.
- [x] Crear toolbar con busqueda y boton de filtros.
- [x] Crear filtros como bottom sheet en mobile y dialogo compacto en desktop.
- [x] Mobile: filas escaneables con cliente, contexto, sede/fecha y estado.
- [x] Desktop: tabla densa con columnas configuradas por entidad.
- [x] Ocultar columnas secundarias antes de provocar overflow; detalle conserva toda la informacion.
- [x] Empty por filtros ofrece Limpiar filtros.
- [x] Error conserva datos anteriores cuando existan y ofrece Reintentar.

### Criterio de salida

- [x] En 390 px se identifica el siguiente pendiente sin scroll horizontal.
- [x] Search encuentra nombre y telefono con normalizacion consistente.
- [x] Filtros de estado y sede pueden combinarse y limpiarse.
- [x] Badges de nav coinciden con la cola accionable.

## Fase 4 - Detalle, WhatsApp y estados

Objetivo: completar el flujo reactivo end-to-end.

### Superficie de detalle

- [x] Crear `ResponsiveDetailSurface`.
- [x] Mobile: bottom sheet con maximo de alto, body scrollable y footer fijo interno.
- [x] Desktop: panel lateral integrado al layout, no modal centrado.
- [x] Gestionar Escape, backdrop mobile, focus inicial, trap y retorno de foco.
- [x] Crear detalle discriminado para pedido, cita y cotizacion con campos exactos.
- [x] Mostrar "Producto no disponible" o "Sede no disponible" si falla la relacion.

### WhatsApp

- [x] Crear `buildAdminWhatsAppMessage` como funcion pura por entidad.
- [x] Probar mensajes de pedido, cita y cotizacion con datos faltantes permitidos.
- [x] Crear `WhatsAppComposer` con telefono destino y textarea editable.
- [x] Normalizar `entity.telefono` con el helper existente antes de habilitar la accion.
- [x] Llamar `openWA(encodeURIComponent(message), entity.telefono)`.
- [x] No usar el WhatsApp de la sede como destino del admin.
- [x] No mutar estado al abrir WhatsApp.
- [x] Si el telefono no es utilizable, deshabilitar accion y explicar el problema.

### Cambio de estado

- [x] Encapsular la mutacion discriminada dentro de `StatusEditor` sin crear un hook adicional para V1.
- [x] Exponer saving, success y error visible en el flujo.
- [x] Crear `StatusEditor` con opciones explicitas, no `<select>`.
- [x] Guardar mediante el API existente y refetch de la entidad correspondiente.
- [x] Mostrar confirmacion de exito con estado nuevo.
- [x] Implementar Deshacer como segundo PATCH al estado anterior.
- [x] Si Deshacer falla, informar y conservar el estado confirmado por servidor.
- [x] Prevenir doble submit del mismo item.

### Pruebas

- [ ] Test integrado: abrir WhatsApp no llama API de estado (la separacion esta verificada por arquitectura, falta spy cruzado).
- [x] Test: el numero destino es el del cliente.
- [ ] Test: success actualiza lista/contador.
- [ ] Test: error mantiene detalle y ofrece Reintentar.
- [ ] Test: Deshacer llama API con estado anterior.

### Criterio de salida

- [ ] Flujo Hoy -> detalle -> WhatsApp -> estado -> Deshacer funciona con una mano en 390 px.
- [x] Todos los estados backend son seleccionables y semanticamente correctos.

## Fase 5 - Catalogo, Categorias y Sedes

Objetivo: migrar mantenimiento ocasional con validacion y feedback completos.

### Validadores puros

- [x] Crear pruebas puras de validacion en `domain/forms.test.ts` antes de formularios.
- [x] Producto: nombre/categoria requeridos, precio no negativo, stock entero no negativo, `imagenUrl` vacia o URL HTTP(S).
- [x] Categoria: key/label requeridos y orden entero no negativo.
- [x] Sede: todos los campos requeridos y Maps como URL HTTP(S).
- [x] No precargar horarios, Maps ni contenido comercial inventado en formularios nuevos.

### Catalogo

- [x] Crear `AdminCatalogPage` con tabs Productos/Categorias.
- [x] Rehacer lista de productos con miniatura/fallback, categoria, precio, stock y destacado.
- [x] Crear `ProductEditor` con errores por campo y foco al primer error.
- [x] Añadir preview en vivo de `imagenUrl` y estado local de imagen invalida.
- [x] Convertir URL vacia a `null` antes de llamar API.
- [x] Crear gestor de categorias usando CRUD ya existente.
- [x] Mostrar cantidad de productos que usan una categoria antes de borrarla.
- [x] Reemplazar confirm nativo por `ConfirmDialog` contextual.
- [x] Mostrar loading/error/empty de productos y categorias por separado.

### Sedes

- [x] Rehacer `AdminLocationsPage` con lista responsive.
- [x] Crear `LocationEditor` con los seis campos reales.
- [x] Eliminar valores default inventados del formulario vacio.
- [x] Omitir accion de prueba de WhatsApp en Sedes: no aporta al mantenimiento V1 y evita confundirla con contacto a cliente.
- [x] Reemplazar confirm nativo por dialogo con nombre de sede.
- [x] Mostrar loading/error/empty del hook actual.
- [x] No hardcodear tres documentos: renderizar lo que Firestore devuelve.

### Criterio de salida

- [ ] CRUD de producto, categoria y sede funciona con datos validos.
- [x] Datos invalidos no llaman API y conservan el formulario.
- [x] Ningun borrado usa dialogo nativo.
- [x] No aparecen emoji fallbacks.

## Fase 6 - Login, limpieza y consistencia

Objetivo: cerrar todas las superficies y retirar el admin anterior.

### Login

- [x] Migrar `AdminLogin.styles.ts` a `AdminLogin.module.css`.
- [x] Eliminar gradiente, emoji y estilos inline.
- [x] Mantener correo, contraseña, autocomplete y error generico actual.
- [x] Mantener ausencia de registro y recuperacion.
- [x] Mostrar loading sin revelar existencia del correo.
- [x] Usar mark geometrico aprobado sin redibujar el logo desde screenshot.

### Limpieza

- [x] Retirar `AdminPanel`, `AdminDash` y vistas antiguas una vez reemplazadas.
- [x] Retirar `Admin.styles.ts`, `AdminProductos.styles.ts` y imports sin uso.
- [x] Eliminar dependencias del admin legacy sobre `src/styles/shared.ts`; el archivo permanece para el storefront.
- [x] Buscar emojis en `src/components/admin`, `src/pages/AdminLogin.tsx` y labels administrativos.
- [x] Buscar `window.confirm`, `window.alert` y `<select>` de estados.
- [x] Verificar smoke visual y funcional del storefront en build productivo.

### Criterio de salida

- [x] No queda arquitectura doble ni componentes legacy activos.
- [x] Login y panel comparten tokens, tipografia e iconografia aprobados.

## Fase 7 - Verificacion integral

Objetivo: demostrar comportamiento, responsive y seguridad antes de deploy.

### Automatizacion

- [x] Ejecutar `npm run test` (37/37).
- [x] Ejecutar `npm run build`.
- [x] Ejecutar `git diff --check`.
- [x] Ejecutar `npm audit` sin exponer secretos (0 vulnerabilidades).
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

- [x] Capturar 390 x 844.
- [x] Capturar 768 x 1024.
- [x] Capturar 1440 px desktop (captura principal a 1000 px de alto y storefront a 900 px).
- [x] Comprobar `scrollWidth === clientWidth` en cada ruta.
- [x] Comprobar que bottom nav no tapa la ultima fila ni footers de formularios.
- [ ] Comprobar teclado movil en formularios con viewport reducido.
- [ ] Comprobar textos largos, nombres extensos y numeros de badges de dos digitos.
- [x] Comparar contra los mockups aprobados y corregir contadores, CTA mobile y jerarquia de color.

### Accesibilidad

- [ ] Navegacion completa por teclado.
- [x] Focus visible y retorno de foco en dialogos/sheets.
- [x] Lectura de estados sin depender de color.
- [x] Confirmacion de estado anunciada por `aria-live` local.
- [x] Targets tactiles de 44 px en acciones principales.
- [x] Reduced motion respetado en el unico skeleton animado de autenticacion.

### Produccion

- [ ] Verificar manualmente contra backend real sin editar registros sensibles de forma destructiva.
- [x] Confirmar en codigo que Auth sigue exigiendo custom claim `admin:true`; falta login real.
- [x] Confirmar que el bundle publico no carga la entrada `AdminRoutes-*` anticipadamente.
- [x] Actualizar checkboxes de MAR-113 solo con evidencia; el issue permanece In Progress con dos AC pendientes.
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
- [x] Todos los checkboxes de este plan estan completos o documentados honestamente.
- [x] No hay cambios backend ni claims nuevos ocultos dentro del rediseño.
- [ ] Tests, build, audit y E2E responsive pasan.
- [ ] Mockups aprobados y produccion coinciden en jerarquia, flujo y color funcional.
- [ ] Deploy de Firebase Hosting verificado en mobile y desktop.
- [x] Obsidian y daily registran decisiones y resultados, no una copia de Linear.

## Puerta de ejecucion

No comenzar implementacion hasta recibir confirmacion explicita sobre este plan.
