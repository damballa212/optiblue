# OptiBlue V1 - Plan de consistencia mobile, PWA y operacion del backoffice

Fecha: 2026-07-12

Repositorios auditados:

- Frontend: `/Users/marlon/Documents/trae_projects/optiblue/optiblue-web`
- Backend: `/Users/marlon/Documents/trae_projects/optiblue/optiblue-backend`

Estado: implementacion local completada; validacion visual real, commit y deploy pendientes.

Tracking relacionado: `MAR-120` cubre la consistencia UX del backoffice y `MAR-119` sigue en progreso para la verificacion end-to-end de PWA/push. Este documento no reemplaza Linear ni replica su estado; define el contexto tecnico y la secuencia de implementacion.

## Resultado de implementacion local

Completado en codigo, sin deploy:

- Shell mobile con un unico scroll owner y navbar fijo fuera del flujo de las rutas.
- App bar compacta y un unico `h1` por pagina operativa mediante `AdminPageHeading`.
- Filtros persistentes en URL, estados vacios honestos, labels humanos y formateadores de fecha/importe.
- Push foreground accionable, refresh selectivo y una sola estrategia de display background.
- Revocacion/reconciliacion del token push en logout/inicio del shell.
- Storefront y panel aislados en entry points, bundles y service workers distintos.
- URLs, metadata, copy offline, instalacion y deteccion iPad corregidos.
- Enlace del login al origen real del storefront corregido.
- Eliminada la particion forzada de Firebase que generaba un ciclo entre chunks y una pantalla blanca antes de montar React.
- Agregado smoke obligatorio del chunk `AdminRoutes` al final de `build:panel`.

Verificacion automatica completada:

- Frontend: 21 archivos, 70 tests; lint, `tsc -b`, ambos builds y `git diff --check` verdes.
- Backend: 8 archivos, 50 tests; build y `git diff --check` verdes.
- Aislamiento comprobado: storefront sin `AdminRoutes` ni Firebase Messaging; panel sin paginas publicas.
- Preview del panel cargado en Chromium a 390x844: login visible y cero errores de pagina/consola.
- `npm audit --omit=dev`: cero vulnerabilidades.
- `pnpm audit --prod`: dos rutas transitivas moderadas hacia `uuid < 11.1.1`; requiere issue separado y no se fuerza una resolucion sin validar compatibilidad.

Gates que siguen abiertos:

- Safari navegador y PWA standalone en iPhone real.
- Matriz visual 390/768/1440, toolbar, teclado, orientacion y ausencia de overflow.
- Flujo push real foreground/background/app cerrada y alta unica.
- Commit, push, deploy y verificacion post-deploy.

## Objetivo V1

Pulir el backoffice existente sin redisenarlo nuevamente ni ampliar el modelo de negocio. El resultado debe:

- Mantener la navegacion inferior exactamente en la misma posicion al cambiar de seccion.
- Funcionar de forma consistente en Safari navegador y en la PWA standalone.
- Mostrar una sola jerarquia de titulo por pantalla.
- Mantener la cola operativa actualizada cuando llega una notificacion.
- Eliminar mensajes, estados y metadatos que contradicen el comportamiento real.
- Conservar el contrato de datos, flujos y alcance V1 existentes.

## Restricciones de alcance

- No cambiar el modelo de datos de pedidos, citas, cotizaciones, productos, categorias o sedes.
- No agregar roles, analytics, calendario real, facturacion, carrito, pagos ni notificaciones a clientes.
- No redisenar nuevamente la identidad visual aprobada del backoffice.
- No inventar reglas de prioridad, moneda, horarios, datos de sedes ni politicas.
- No desplegar cambios sin verificar primero browser mobile, standalone, tablet y desktop.
- No usar `alert()`/`confirm()` nativos ni introducir una segunda libreria visual.

## Evidencia disponible

### Captura recibida en esta auditoria

La captura visible muestra `/admin/cotizaciones` en navegador movil:

- El shell muestra `OPTIBLUE ADMIN` y `Cotizaciones`.
- La pagina vuelve a mostrar `OPERACION` y `Cotizaciones`.
- El contador muestra `0 de 0 registros`.
- La duplicacion consume la primera pantalla y desplaza busqueda y contenido accionable.

En este turno solo estuvo disponible materialmente la captura identificada como `Image #1`. Las referencias a `Image #2`, `Image #3` y `Image #4` no llegaron como archivos inspeccionables. El desplazamiento del navbar descrito por el usuario si queda respaldado por la estructura CSS actual, pero la comparacion visual exacta entre esas tres capturas debe repetirse durante la fase de baseline.

### Estado de produccion verificado

- Storefront: `https://optiblue-prod.web.app`
- Panel: `https://optiblue-panel.web.app`
- Los `index.html` y service workers locales inspeccionados coincidian byte por byte con los publicados al momento de la auditoria.
- Los cambios PWA/push siguen sin commit en ambos repositorios.
- Frontend: 55 entradas modificadas/no trackeadas sobre `1f46795`.
- Backend: 7 entradas modificadas/no trackeadas sobre `78b4d24`.

## Diagnostico confirmado

### P0 - El navbar inferior no pertenece al viewport

Archivos:

- `src/components/admin/AdminShell.tsx`
- `src/components/admin/ui/AdminLayout.module.css`
- `src/styles/global.css`

Evidencia de codigo:

- `.bottomNav` usa `position: relative`; no esta anclado al viewport.
- `.adminWorkspace` lo coloca como la tercera fila de un grid.
- `.adminWorkspace` tiene `min-height: 100svh`, no una altura definida.
- `.adminMain` declara `overflow: auto`, pero su padre no tiene una altura definida que limite ese scroll.
- Cuando una pagina necesita mas alto, el grid puede crecer y empujar la tercera fila.
- `body` y `#root` usan `min-height: 100vh`, mientras el shell usa `100svh`. En navegador movil esas unidades representan contratos distintos cuando aparece o desaparece el chrome del navegador.
- La pagina `Mas` cambia su altura segun el estado de `PushSettings` y sus grupos de mantenimiento/acceso; por eso expone el defecto con mas facilidad.

Conclusion: cambiar solamente `dvh` por `svh` no resuelve el modelo de layout. El problema es que el navbar sigue participando en el flujo y depende de la altura de cada ruta.

### P0 - La cola no se actualiza al recibir push

Archivos:

- `src/components/admin/notifications/AdminPushToast.tsx`
- `src/lib/push/usePushForeground.ts`
- `src/components/admin/data/AdminOperationsContext.tsx`
- `src/sw.panel.ts`

Evidencia de codigo:

- El mensaje foreground solo actualiza el estado del toast.
- No ejecuta `refreshPedidos`, `refreshCitas` o `refreshCotizaciones`.
- El click del service worker enfoca/abre una ventana, pero no comunica al cliente que debe refrescar.
- Los tres hooks operativos hacen fetch al montar y luego solo refrescan manualmente o despues de una mutacion.

Impacto: el admin puede recibir `Nuevo pedido` y continuar viendo una lista y contadores obsoletos.

### P0 - Posibles notificaciones duplicadas

Archivos:

- Backend: `src/modules/notificaciones/notificaciones.service.ts`
- Frontend: `src/sw.panel.ts`

Evidencia de codigo:

- El backend envia un payload FCM con `notification`.
- FCM muestra automaticamente ese tipo de mensaje cuando la web esta en background.
- `onBackgroundMessage` ejecuta adicionalmente `self.registration.showNotification()`.
- El listener personalizado de `notificationclick` se registra despues de importar Firebase Messaging, contrario al orden advertido por Firebase para handlers personalizados.

Decision recomendada para V1: usar una sola estrategia. La opcion de menor complejidad es conservar el payload `notification` del backend, `webpush.fcmOptions.link` e icono, y eliminar la visualizacion manual duplicada. El toast foreground se conserva porque FCM no muestra automaticamente la notificacion del sistema con la pagina enfocada.

### P1 - Jerarquia de titulos duplicada

Archivos:

- `src/components/admin/AdminShell.tsx`
- `src/components/admin/pages/AdminWorkPage.tsx`
- `src/components/admin/pages/AdminMorePage.tsx`
- `src/components/admin/pages/AdminCatalogPage.tsx`
- `src/components/admin/pages/AdminLocationsPage.tsx`

Rutas afectadas:

- Pedidos: `Pedidos` en shell + `Pedidos` en pagina.
- Citas: `Citas` en shell + `Citas` en pagina.
- Cotizaciones: `Cotizaciones` en shell + `Cotizaciones` en pagina.
- Mas: `Mas` en shell + `Mas` en pagina.
- Catalogo: `Catalogo` en shell + `Catalogo` en pagina.
- Sedes: `Sedes` en shell + `Sedes` en pagina.

`Hoy` no repite literalmente el titulo porque su encabezado interior es `Que requiere atencion`, pero sigue usando dos bloques verticales de encabezado.

Direccion propuesta:

- Convertir el header movil del shell en una barra de producto compacta, no en un segundo titulo de pagina.
- Mantener un unico `h1` semantico dentro de cada pagina.
- Conservar eyebrow, contexto, contador y accion solo cuando aportan informacion distinta.
- Mantener el header desktop compacto como contexto global, sin duplicar visualmente el heading principal.

No se propone ocultar textos con CSS de forma aislada; la semantica y el DOM deben quedar correctos.

### P1 - Empty state incorrecto para listas realmente vacias

Archivo: `src/components/admin/pages/AdminWorkPage.tsx`

La rama `filtered.length === 0` siempre muestra:

- `No hay resultados con estos filtros`.
- `Limpia los filtros o prueba otra busqueda`.
- Accion `Limpiar filtros`.

Eso tambien ocurre cuando `records.length === 0`, `query` esta vacio y no existen filtros activos. En la captura se ve el precursor `0 de 0 registros`.

Estados que deben separarse:

1. Coleccion vacia sin filtros: `Todavia no hay cotizaciones` (o entidad correspondiente), sin sugerir filtros inexistentes.
2. Coleccion con datos pero cero coincidencias: empty state de busqueda/filtros con accion de limpiar.
3. Error sin datos: error con reintento.
4. Error con datos previos: aviso no bloqueante conservando la lista.
5. Loading inicial: skeleton.
6. Refetch con datos: conservar lista y mostrar progreso discreto, sin sustituirla por skeleton.

### P1 - Navegacion de `Mas` pierde su estado activo

Archivos:

- `src/components/admin/AdminShell.tsx`
- `src/components/admin/pages/AdminMorePage.tsx`

Al abrir `/admin/catalogo` o `/admin/sedes` desde `Mas`, ninguna de las cinco tabs inferiores queda activa. Esas rutas son hijas conceptuales de `Mas`, pero el `NavLink` actual solo activa `/admin/mas`.

Debe existir una funcion unica de agrupacion de rutas:

- `Hoy`: `/admin/hoy`
- `Pedidos`: `/admin/pedidos`
- `Citas`: `/admin/citas`
- `Cotizaciones`: `/admin/cotizaciones`
- `Mas`: `/admin/mas`, `/admin/catalogo`, `/admin/sedes`

### P1 - Cambiar de tab destruye busqueda y filtros

Archivo: `src/components/admin/pages/AdminWorkPage.tsx`

`query`, `estado` y `sedeId` viven en `useState` local. Al salir de una ruta y regresar, React desmonta la pagina y pierde ese contexto. Para una navegacion por tabs, esto contradice la expectativa de volver al mismo estado de trabajo.

Implementacion V1 propuesta:

- Persistir filtros en `URLSearchParams` por ruta.
- No crear un store global nuevo.
- Validar parametros contra estados y sedes reales antes de aplicarlos.
- Definir explicitamente si el scroll se reinicia al entrar a otra tab o se restaura por tab. No dejar el `scrollTop` del contenedor compartido como comportamiento accidental.

### P1 - `Ver sitio publico` abre el panel otra vez

Archivos:

- `src/components/admin/AdminShell.tsx`
- `src/components/admin/pages/AdminMorePage.tsx`
- `src/App.tsx`

Ambos botones usan `window.open("/")`. Desde `optiblue-panel.web.app`, `/` pertenece al panel y la ruta wildcard redirige a `/admin/hoy`.

Debe usarse una URL de storefront configurada y tipada por entorno. No hardcodear dos veces el dominio.

### P1 - Metadata del panel apunta al storefront

Archivo: `src/components/layout/RouteMetadata.tsx`

`SITE_URL` esta fijado a `https://optiblue-prod.web.app`. En el build del panel, React sobrescribe canonical y Open Graph con URLs del storefront aunque el HTML estatico se haya generado correctamente para `optiblue-panel.web.app`.

Debe derivarse de `VITE_APP_URL` y del target de build, conservando `noindex,nofollow` en todo el panel.

### P1 - Mensaje offline falso dentro del panel

Archivos:

- `src/components/shared/OfflineBanner.tsx`
- `src/lib/firestore.ts`
- `src/hooks/usePedidos.ts`
- `src/hooks/useCitas.ts`
- `src/hooks/useCotizaciones.ts`

`Sin conexion - mostrando los ultimos datos guardados` solo es cierto para lecturas publicas persistidas por Firestore. Pedidos, citas y cotizaciones usan Functions via `fetch` y no tienen cache persistente.

Copy minimo correcto:

- Storefront: puede mencionar ultimos datos guardados.
- Panel: `Sin conexion. Algunas acciones y datos pueden no estar disponibles.`

No agregar cola offline en V1.

### P1 - Ciclo de vida y privacidad del token push

Archivos:

- `src/components/admin/notifications/PushSettings.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/components/admin/pages/AdminMorePage.tsx`
- Backend: `src/modules/notificaciones/notificaciones.service.ts`

Hechos confirmados:

- El token se guarda en `localStorage`.
- Cerrar sesion no lo elimina ni lo desregistra.
- Si el backend elimina un token invalido, la UI local sigue mostrando notificaciones activas.
- El payload visible incluye nombre del cliente y ciudad; puede aparecer en pantalla bloqueada.

Antes de implementar debe aprobarse una politica explicita:

- Opcion recomendada: cerrar sesion desregistra el token del dispositivo y limpia estado local.
- Alternativa: mantener push tras logout, pero eliminar nombre del cliente del payload y documentar el comportamiento. No adoptar esta alternativa por accidente.

### P2 - Builds separados, bundles mezclados

Archivos:

- `src/App.tsx`
- `vite.config.ts`

Todos los `lazy(() => import(...))` se declaran antes de evaluar `VITE_APP_TARGET`. Resultado comprobado en `dist-*`:

- El storefront contiene y precachea `AdminRoutes`.
- El panel contiene y precachea Home, Catalogo, Lentes, Servicios y Sedes publicos.

No es un bypass de autenticacion, pero contradice el aislamiento, aumenta el precache y dificulta razonar sobre cada PWA.

Solucion V1: separar entry/app roots por target o condicionar imports en modulos que el bundler pueda eliminar estaticamente. Verificar el contenido final de ambos manifests de precache, no solo que las rutas redirijan.

### P2 - Inconsistencias de copy y valores tecnicos visibles

Archivos principales:

- `src/components/admin/ui/AdminEntityDetail.tsx`
- `src/components/admin/ui/StatusEditor.tsx`
- `src/components/admin/pages/AdminWorkPage.tsx`
- `src/components/admin/domain/whatsapp.ts`

Hallazgos:

- `Telefono` aparece sin tilde.
- Eyebrows muestran `cotizacion` sin tilde y en singular tecnico.
- El toast de exito usa el enum crudo; puede mostrar `no_pagado`.
- Los filtros activos muestran el enum crudo.
- Mensajes WhatsApp contienen `cotizacion`, `esta` y `confirmacion` sin tildes.
- Fechas se muestran como `YYYY-MM-DD` en listas, cola y detalle.
- Importes concatenan `$` y el numero sin formateador comun.
- `0 de 0 registros` es mecanico; sin filtros debe decir `0 registros`, y con filtros `X de Y`.
- `AdminDataState` usa siempre `RotateCw` cuando hay una accion, incluso para `Crear sede` o `Limpiar filtros`.

Solucion: crear helpers tipados de presentacion para entidad, estado, fecha y numero. No cambiar contratos backend. La moneda debe conservar el convenio ya aprobado o confirmarse antes de cambiar simbolo/codigo.

### P2 - La prioridad de `Hoy` no tiene contrato de negocio documentado

Archivo: `src/components/admin/domain/attention.ts`

El algoritmo actual coloca todas las citas con fecha valida antes que todos los pedidos y cotizaciones, aunque una cita sea futura. Luego ordena operaciones por fecha descendente. La UI lo presenta como `Prioridad verificada`.

No se debe inventar otra regla. Antes de tocar el orden hay que confirmar con el negocio, usando solo campos disponibles:

- Si citas vencidas/de hoy deben preceder al resto.
- Si pedidos/cotizaciones deben ordenarse por mas antiguo pendiente o mas reciente.
- Como tratar fechas invalidas o ausentes.

Hasta confirmar, cambiar `Prioridad verificada` por un copy neutral como `Orden operativo` evita prometer una semantica no acordada.

### P2 - Instalacion, iPad y targets tactiles

Archivos:

- `src/components/shared/InstallBanner.tsx`
- `src/components/shared/InstallBanner.module.css`
- `src/lib/pwa/installPrompt.ts`
- `src/components/admin/notifications/*.module.css`

Hallazgos:

- `InstallBanner` se renderiza despues del footer y usa `position: sticky`; no funciona como aviso global desde la primera pantalla.
- `isIOS()` solo busca `iphone|ipad|ipod`; iPadOS puede usar un user agent de Macintosh.
- Hay controles nuevos de 28, 32, 36, 38 y 42 px. Cumplir 24 px de WCAG minimo no equivale al objetivo profesional de 44 px para uso con una mano.

### P2 - Higiene de repositorio y comentarios desactualizados

- `dist-storefront/` y `dist-panel/` no estan ignorados por Git.
- Produccion depende de cambios locales no commiteados en frontend y backend.
- `scripts/generate-icons.mjs` conserva comentarios con colores storefront/panel invertidos y menciona el eliminado `useAdminManifest.ts`.
- Los README no explican dos hostings, dos SW, PWA ni push.
- Ninguno de los repositorios tiene `AGENTS.md` propio.

## Direccion tecnica del shell movil

### Contrato recomendado

En mobile:

1. Un solo scroll owner para el contenido.
2. App bar compacta fuera del scroll o sticky dentro de un contenedor definido.
3. Navbar inferior con `position: fixed`, `inset-inline: 0`, `bottom: 0` y safe area.
4. Contenido con padding inferior igual a la altura real del navbar + safe area.
5. Ninguna ruta puede cambiar la geometria del navbar.
6. El teclado no debe dejar el navbar flotando sobre inputs o acciones.
7. En desktop se mantiene sidebar y se elimina la reserva de espacio del navbar mobile.

No copiar literalmente el navbar publico: puede reutilizarse su patron de anclaje porque ya usa `position: fixed`, pero el admin debe conservar sus cinco tabs, badges y densidad operativa.

### Viewport units

La especificacion CSS distingue:

- `svh`: viewport pequeno, con interfaces del navegador expandidas.
- `lvh`: viewport grande, con interfaces retraidas.
- `dvh`: viewport dinamico, cambia con el chrome del navegador.

La especificacion tambien advierte que el user agent no esta obligado a animar `dvh` continuamente durante la transicion. Por eso no debe usarse una unidad de viewport como sustituto de anclar correctamente la navegacion.

Propuesta a validar:

- Eliminar la mezcla `100vh` global + `100svh` del shell.
- Usar un contrato unico para `html/body/#root` y el panel.
- Anclar el navbar independientemente de la altura de las rutas.
- Medir `window.innerHeight`, `visualViewport.height`, `documentElement.clientHeight` y el rect del navbar en Safari real antes y despues.

## Plan por fases

### Fase 0 - Baseline reproducible, sin fixes

- [ ] Adjuntar las capturas faltantes de Cotizaciones y Mas en navegador.
- [ ] Capturar Hoy, Pedidos, Citas, Cotizaciones y Mas en Safari navegador con toolbar expandida.
- [ ] Repetir con toolbar retraida despues de scroll.
- [ ] Repetir en PWA standalone.
- [ ] Registrar por ruta: `innerHeight`, `visualViewport.height`, `clientHeight`, `scrollHeight` del shell/main y `getBoundingClientRect()` del navbar.
- [ ] Registrar `scrollTop` antes y despues de cambiar de tab.
- [ ] Capturar Catalogo y Sedes y verificar que `Mas` permanece activo.
- [ ] Capturar teclado abierto en busqueda, textarea WhatsApp y formularios de mantenimiento.
- [ ] Guardar baseline en 390 px, 768 px y 1440 px.
- [ ] Confirmar explicitamente login del panel en produccion sin usar datos reales de clientes.

Acceptance criteria:

- [ ] La causa del desplazamiento queda demostrada con medidas, no solo con capturas.
- [ ] Existe una captura comparable antes del fix para cada modo requerido.

### Fase 1 - Shell y navbar estable

- [x] Definir un unico scroll owner mobile.
- [x] Sacar el navbar del flujo de las rutas.
- [x] Fijar navbar al fondo visible con safe area.
- [x] Reservar su altura en el contenido para evitar solapamientos.
- [x] Unificar el contrato de alto entre `html`, `body`, `#root`, `.adminShell` y `.adminWorkspace`.
- [x] Eliminar reglas/comentarios que presenten `svh` como solucion completa.
- [x] Resetear o restaurar scroll por tab mediante una regla explicita.
- [x] Mantener `Mas` activo en Mas/Catalogo/Sedes.
- [ ] Verificar orientacion vertical y horizontal.
- [ ] Verificar toolbar expandida/retraida sin saltos.
- [ ] Verificar teclado sin tapar el campo activo ni la accion principal.

Acceptance criteria:

- [ ] El borde superior del navbar mantiene una posicion estable respecto al viewport visible al cambiar entre las cinco tabs.
- [ ] La diferencia vertical entre rutas es <= 1 CSS px en la misma configuracion de navegador.
- [ ] No existe scroll del documento ademas del scroll owner definido.
- [ ] El ultimo contenido puede desplazarse completamente por encima del navbar.
- [ ] Standalone conserva el comportamiento actualmente aprobado.

### Fase 2 - Una sola jerarquia de pagina

- [x] Convertir el mobile header del shell en app bar compacta.
- [x] Definir un componente comun de page heading con `h1`, eyebrow, supporting copy y accion opcional.
- [x] Migrar Hoy.
- [x] Migrar Pedidos/Citas/Cotizaciones.
- [x] Migrar Mas.
- [x] Migrar Catalogo/Sedes.
- [x] Verificar que cada ruta tenga exactamente un `h1` visible.
- [ ] Mantener el buscador dentro de la primera pantalla de las listas en 390 px.
- [ ] Revisar espaciado y escala sin cambiar la paleta aprobada.

Acceptance criteria:

- [x] Ninguna ruta repite literalmente su nombre en dos headings consecutivos.
- [x] Cotizaciones muestra marca/contexto, un solo titulo, contador y busqueda sin bloque redundante.
- [x] La jerarquia semantica pasa inspeccion de headings.

### Fase 3 - Estados, copy y formato profesional

- [x] Separar coleccion vacia de filtros sin resultados.
- [x] Corregir contadores filtrados/no filtrados.
- [x] Permitir icono de accion especifico en `AdminDataState`.
- [x] Centralizar labels de entidad y estado.
- [x] Evitar enums crudos en filtros, modales y toasts.
- [x] Corregir tildes y microcopy del panel/WhatsApp.
- [x] Crear formateador de fecha sin romper el valor ISO usado por backend.
- [x] Crear formateador numerico/monetario despues de confirmar el convenio de moneda.
- [x] Cambiar `Prioridad verificada` por copy neutral mientras no exista regla aprobada.
- [ ] Añadir tests de cada estado visible.

Acceptance criteria:

- [x] Con cero registros no aparece ninguna accion de limpiar filtros inexistentes.
- [x] `no_pagado`, `cotizacion` y otros valores tecnicos nunca aparecen al usuario.
- [x] Las fechas se leen de forma local y consistente en lista, Hoy y detalle.

### Fase 4 - Push operativo y ciclo de datos

- [x] Elegir una sola estrategia de notificacion background.
- [x] Eliminar la visualizacion duplicada.
- [x] Mantener toast foreground.
- [x] Conservar `tipo` e `id` del payload en el cliente.
- [x] Refrescar solo la coleccion afectada cuando llega push.
- [x] Actualizar contadores y lista sin recargar toda la app.
- [x] Hacer el toast accionable hacia la seccion correcta.
- [ ] Definir comportamiento cuando el item ya esta abierto.
- [x] Definir y aplicar politica de token al cerrar sesion.
- [x] Reconciliar token local con backend/FCM al iniciar sesion.
- [ ] Reducir informacion visible en lock screen si se decide mantener push tras logout.
- [ ] Probar foreground, background, app cerrada y token invalido.

Acceptance criteria:

- [ ] Un alta produce un solo aviso visible.
- [ ] Al recibirlo, la cola y badges muestran el nuevo item sin refresh manual.
- [ ] El click abre la seccion correcta.
- [ ] La UI nunca dice `activas` si el token ya no esta registrado.

### Fase 5 - URLs, metadata, offline y builds

- [x] Configurar URL del storefront por entorno y reutilizarla en ambos botones admin.
- [x] Derivar metadata del target actual.
- [x] Mantener panel `noindex,nofollow`.
- [x] Separar copy offline de storefront y panel.
- [x] Aislar imports/bundles por target.
- [x] Verificar que storefront no contenga `AdminRoutes`.
- [x] Verificar que panel no contenga chunks de paginas publicas.
- [x] Verificar que cada SW precachee solo sus assets.
- [ ] Verificar headers no-cache/immutable despues del deploy.

Acceptance criteria:

- [x] `Ver sitio publico` abre `optiblue-prod.web.app` desde el panel.
- [x] Canonical/OG del panel nunca apuntan a una ruta `/admin/*` del storefront.
- [x] El mensaje offline describe honestamente la capacidad de cada app.

### Fase 6 - Instalacion, accesibilidad y mantenimiento

- [x] Reubicar/rediseñar el prompt de instalacion para que aparezca donde corresponde.
- [x] Reemplazar deteccion iPad dependiente solo de user agent.
- [x] Llevar acciones tactiles prioritarias a 44x44 CSS px.
- [ ] Verificar WCAG 2.2 2.5.8 como minimo y usar 44 px como objetivo interno.
- [x] Ignorar `dist-storefront/` y `dist-panel/` si se confirma que son artefactos.
- [x] Corregir comentarios del generador de iconos.
- [x] Documentar arquitectura PWA/push en los README.
- [ ] Resolver con Marlon si los `AGENTS.md` se versionan o quedan locales.

### Fase 7 - Verificacion y entrega

- [ ] Tests unitarios de route grouping, labels, empty states, formatters y refresh por push.
- [ ] Tests de componentes para heading unico y estado activo de Mas.
- [ ] E2E mobile browser para las cinco tabs.
- [ ] E2E standalone donde la automatizacion lo permita.
- [ ] Verificacion manual obligatoria en iPhone real.
- [ ] Verificacion 390, 768 y 1440 sin overflow horizontal.
- [x] `tsc -b` verde.
- [x] `npm run lint` verde.
- [x] Suite frontend verde.
- [x] Suite backend verde.
- [x] `npm audit` revisado antes de commit; frontend limpio y backend con hallazgo transitive moderado documentado.
- [x] `git diff --check` verde.
- [x] Revisar que no existan secretos/credenciales en el diff.
- [ ] Commit frontend y backend antes de desplegar.
- [ ] Referenciar commits en Linear.
- [ ] Desplegar backend antes que frontend si cambia el contrato push.
- [ ] Desplegar ambos hostings.
- [ ] Repetir matriz real post-deploy.
- [ ] Cerrar `MAR-119` solo con entrega push y login explicitamente confirmados.

## Matriz de regresion obligatoria

| Superficie | 390 px | 768 px | 1440 px | Safari browser | Standalone | Teclado |
|---|---:|---:|---:|---:|---:|---:|
| Hoy | [ ] | [ ] | [ ] | [ ] | [ ] | N/A |
| Pedidos | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Citas | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cotizaciones | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Mas | [ ] | [ ] | [ ] | [ ] | [ ] | N/A |
| Catalogo | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Sedes | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Detalle | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| WhatsApp | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Cambiar estado | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

Para cada celda mobile se debe revisar:

- Navbar en la misma coordenada.
- Tab correcta activa.
- Un solo titulo principal.
- Sin contenido oculto por navbar/toolbar/teclado.
- Sin scroll horizontal.
- Focus visible y retorno de foco correcto.
- Targets tactiles suficientes.
- Loading/error/empty/success coherentes.

## Pruebas que deben agregarse

### Unitarias

- [ ] Agrupacion de `/admin/catalogo` y `/admin/sedes` bajo `Mas`.
- [ ] Empty state sin datos y sin filtros.
- [ ] Empty state con filtros activos.
- [ ] Labels de `no_pagado`, `cotizacion` y estados restantes.
- [ ] Formateo de fecha valida/invalida sin errores de zona horaria.
- [ ] Evento push refresca solo la coleccion correcta.
- [ ] Logout aplica la politica de token aprobada.

### Componentes

- [ ] Cada ruta tiene un solo `h1`.
- [ ] El toast push navega y actualiza.
- [ ] `AdminDataState` usa icono/accion semanticamente correctos.
- [ ] Filtros sobreviven navegacion al estar en URL.

### E2E/visual

- [ ] Bounding box del navbar estable entre tabs.
- [ ] Browser toolbar expandida/retraida.
- [ ] Standalone con safe area.
- [ ] Input enfocado sin zoom pegado.
- [ ] Teclado abierto sin ocultar CTA.
- [ ] Capturas visuales de rutas vacias y con datos.

## Orden recomendado de ejecucion

1. Fase 0: medir el bug real.
2. Fase 1: estabilizar shell/navbar.
3. Fase 2: eliminar headings duplicados.
4. Fase 3: pulir estados y copy.
5. Fase 4: corregir push y refresco operativo.
6. Fase 5: corregir aislamiento, URLs y offline.
7. Fase 6: accesibilidad/documentacion.
8. Fase 7: pruebas, commit y deploy.

No conviene mezclar la correccion del shell con cambios de push en un solo commit. Deben poder revisarse y revertirse de forma independiente.

## Fuentes tecnicas consultadas

- CSS Values and Units Level 4, definicion de `svh`, `lvh` y `dvh`: https://www.w3.org/TR/css-values-4/
- CSS Working Group, introduccion de nuevas viewport units: https://www.w3.org/blog/CSS/2021/07/15/css-values-4-viewport-units/
- WebKit, `viewport-fit=cover` y `safe-area-inset-*`: https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- Apple HIG, tab bars actualizadas en junio de 2026: https://developer.apple.com/design/human-interface-guidelines/tab-bars
- Apple HIG, search fields y comportamiento con teclado/tab bar: https://developer.apple.com/design/human-interface-guidelines/search-fields
- WCAG 2.2, Target Size Minimum 24 CSS px: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- WCAG 2.2, Target Size Enhanced 44 CSS px: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced
- Firebase, recepcion de mensajes web y display automatico en background: https://firebase.google.com/docs/cloud-messaging/web/receive-messages
- Firebase, tipos de mensaje notification/data: https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type

## Definition of Done global

- [ ] El usuario puede cambiar repetidamente entre las cinco tabs sin que el navbar se mueva.
- [ ] Safari navegador y standalone mantienen la misma jerarquia y geometria util.
- [x] Cada pantalla muestra un solo titulo principal.
- [x] La primera pantalla de una lista prioriza busqueda, filtros y trabajo, no chrome duplicado.
- [ ] Un push actualiza cola y badges y genera un solo aviso.
- [x] Empty/error/offline states describen el estado real.
- [x] No aparecen enums, fechas o copies tecnicos sin formatear.
- [x] No se agregaron features ni campos fuera de V1.
- [ ] Produccion queda representada por commits remotos reproducibles en ambos repositorios.
