# OptiBlue Back Office Redesign - Especificacion de Diseno

Fecha: 2026-07-12
Estado: aprobado visualmente; pendiente de implementacion
Alcance: rediseño total del panel administrativo V1
Linear: pendiente de autorizacion explicita del usuario

## Objetivo

Reemplazar el panel administrativo generico actual por una herramienta operativa mobile-first para el dueño y personal de OptiBlue.

El producto debe responder primero a una pregunta: "¿que requiere atencion ahora?". El flujo dominante es:

1. Detectar un pedido, cita o cotizacion pendiente.
2. Abrir el detalle.
3. Preparar y editar el mensaje de WhatsApp.
4. Contactar al cliente.
5. Cambiar el estado de forma explicita.
6. Ver el resultado y poder deshacer inmediatamente.

El mantenimiento de productos, categorias y sedes es secundario y no debe competir con la operacion diaria.

## Fuentes Visuales Aprobadas

La implementacion debe reproducir las decisiones aprobadas en el companion visual local:

- `.superpowers/brainstorm/96830-1783874776/content/direccion-backoffice-v2.html`
- `.superpowers/brainstorm/96830-1783874776/content/estructura-backoffice.html`
- `.superpowers/brainstorm/96830-1783874776/content/flujos-backoffice.html`
- `.superpowers/brainstorm/96830-1783874776/content/sistema-mantenimiento-backoffice.html`
- `.superpowers/brainstorm/96830-1783874776/content/sistema-color-backoffice-v2.html`

Las propuestas visuales anteriores a estas versiones fueron descartadas. No son referencia de implementacion.

## Evidencia Verificada

### Frontend actual

- React 19.2, TypeScript estricto, Vite 8 y React Router 7.
- `lucide-react` ya esta instalado.
- La autenticacion administrativa usa correo y contraseña de Firebase.
- `RequireAdmin` valida usuario y custom claim `admin: true`.
- Los clientes de API administrativa envian Bearer token.
- Pedidos, citas y cotizaciones se cargan mediante Cloud Functions protegidas y refetch manual; no son realtime.
- Productos, categorias y sedes ya tienen operaciones CRUD administrativas.
- El panel actual usa una seccion interna, sidebar fijo, tablas y estilos inline. Ese armazon visual se reemplaza.

### Contrato de datos

Pedido:

- `id`
- `nombre`
- `telefono`
- `sedeId`
- `productoId`
- `precio`
- `fecha`
- `estado: pendiente | pagado | no_pagado`

Cita:

- `id`
- `nombre`
- `telefono`
- `sedeId`
- `fecha`
- `hora`
- `motivo`
- `nota`
- `estado: pendiente | confirmada | completada | cancelada`

Cotizacion:

- `id`
- `nombre`
- `telefono`
- `sedeId`
- `productoId`
- `od`
- `oi`
- `astigmatismoOD`
- `astigmatismoOI`
- `extras`
- `total`
- `fecha`
- `estado: pendiente | contactado | cerrada`

Producto:

- `id`
- `nombre`
- `categoriaId`
- `precio`
- `imagenUrl: string | null`
- `descripcion`
- `stock`
- `destacado`

Categoria:

- `id`
- `key`
- `label`
- `orden`

Sede:

- `id`
- `ciudad`
- `direccion`
- `telefono`
- `whatsapp`
- `horario`
- `maps`

### Restricciones confirmadas

- El backend solo permite cambiar `estado` en pedidos, citas y cotizaciones ya creados.
- No existe estado `leido`, `nuevo`, `asignado` ni `en progreso` generico.
- No existe timestamp de recepcion ni historial de cambios.
- `fecha` es un `string` sin validacion de formato en backend.
- En el storefront actual, pedidos y cotizaciones escriben fecha de creacion `YYYY-MM-DD`.
- En citas, `fecha` y `hora` representan preferencia solicitada, no disponibilidad confirmada.
- No existe realtime, push, multiusuario, permisos por rol, calendario de slots, facturacion ni analytics avanzados.
- No existe foto de sede ni multiples imagenes por producto.

## No Objetivos V1

- No agregar nuevos campos a Firestore para sostener el diseño.
- No crear notificaciones push ni contadores de no leidos.
- No inventar tiempos como "hace 5 minutos".
- No crear historial persistente de estados.
- No agregar roles, asignacion a personal o auditoria.
- No implementar calendario de disponibilidad.
- No crear reportes, facturas, pagos, carrito ni inventario por sede.
- No editar campos de pedidos, citas o cotizaciones distintos de `estado`.
- No agregar carga de archivos; producto mantiene una sola `imagenUrl`.
- No mostrar atributos de producto inexistentes como marca, color, material, medidas o variantes.

## Principios UX

### Accion antes que metricas

"Hoy" es una bandeja operativa, no un dashboard historico. Los numeros superiores son contadores de pendientes que llevan a trabajo concreto.

### Mobile-first real

La experiencia primaria se diseña para 390 px y uso con una mano. Desktop conserva el mismo modelo mental y añade densidad, no funciones diferentes.

### Progresion explicita

WhatsApp y cambio de estado son acciones separadas. Abrir WhatsApp no prueba que el cliente fue contactado y nunca cambia el estado automaticamente.

### Color con proposito

La base diaria es neutral. El color aparece solo cuando cambia la decision del admin:

- Pendiente o requiere accion: indicador ambar pequeño.
- Confirmada o contactado: indicador azul pequeño.
- Pagado, completada o cerrada: estado neutral con texto e icono.
- No pagado o cancelada: cierre neutral diferenciado por icono, no rojo permanente.
- Error bloqueante o borrado: rojo.
- WhatsApp: verde `#25D366` o variante con contraste AA, exclusivamente para contacto.

Esta decision sigue el patron de color funcional observado en Shopify Polaris: base neutral, color para atencion y color nunca como unico portador de significado.

## Sistema Visual

### Colores

Base cotidiana:

- Fondo: `#F4F6F8`.
- Superficie: `#FFFFFF`.
- Texto principal: `#172438`.
- Texto secundario: `#65758A`.
- Bordes: `#DCE3EA` y `#C8D2DD`.

Marca y accion:

- Navy estructural: `#002D63`.
- Navy profundo: `#001D42`.
- Azul de accion: `#1F5BFF`.
- Celeste de detalle: `#54BFE8`.

Señales reservadas:

- Atencion: ambar oscuro sobre fondo ambar muy suave.
- Critico: rojo solo para error bloqueante o accion destructiva.
- WhatsApp: verde solo para el comando de contacto.

No se debe presentar una paleta multicolor simultanea en listas, dashboards o formularios.

### Tipografia

- Headings de pagina: Space Grotesk 600-700.
- Body, UI, formularios y numeros: DM Sans 400-700.
- Numeros operativos usan `font-variant-numeric: tabular-nums`.
- Mobile H1 interno: 24-28 px.
- Desktop H1 interno: 28-32 px.
- Body: 14-16 px.
- Metadata densa: 12-13 px, nunca menor de 12 px en implementacion real.
- Letter spacing: `0` salvo labels uppercase cortos con espaciado positivo discreto.

### Forma y elevacion

- Controles y filas: radio 6 px.
- Paneles, modales y sheets: radio 8 px; sheet movil 16 px solo en esquinas superiores.
- Cards individuales: maximo 8 px.
- La lista continua usa divisores, no una tarjeta separada por registro.
- Sombras solo para overlays, sidebar/panel elevado y toast.
- Target tactil minimo: 44 x 44 px.

### Iconografia

- Usar `lucide-react` en todo el back office.
- Stroke consistente entre 1.75 y 2.
- No usar emojis, caracteres como iconos ni SVG manuales cuando exista un icono Lucide.
- Estado siempre combina texto con punto o icono; nunca depende solo del color.

## Arquitectura de Informacion

### Navegacion movil

Barra inferior con exactamente cinco destinos:

1. Hoy.
2. Pedidos.
3. Citas.
4. Cotizaciones.
5. Mas.

Pedidos, Citas y Cotizaciones muestran badge con cantidad accionable. Los badges se calculan a partir de los datos cargados; no implican notificacion ni no leido.

"Mas" contiene:

- Catalogo: productos y categorias.
- Sedes.
- Ver sitio publico.
- Cerrar sesion.

La barra inferior ocupa una fila propia del layout, respeta `env(safe-area-inset-bottom)` y nunca se superpone al contenido.

### Navegacion desktop

- Sidebar de 198-220 px con los mismos destinos y contadores.
- Area principal con header compacto.
- Listas operativas en el centro.
- Panel de detalle lateral de 320-400 px cuando hay seleccion.
- En tablet, el detalle se presenta como sheet o panel superpuesto segun el espacio medido.

## Hoy

### Elementos accionables

Solo entran en la cola:

- Pedidos con `estado === "pendiente"`.
- Citas con `estado === "pendiente"`.
- Cotizaciones con `estado === "pendiente"`.

Los elementos contactados, confirmados o terminales permanecen en sus secciones, pero no compiten en "Hoy".

### Regla de prioridad aprobada

1. Citas pendientes con fecha/hora interpretable, ordenadas ascendentemente por preferencia; vencidas y mas proximas aparecen primero.
2. Citas pendientes con fecha/hora no interpretable, visibles al final del grupo de citas sin etiqueta temporal inventada.
3. Pedidos y cotizaciones pendientes combinados y ordenados por `fecha` descendente cuando sea interpretable.
4. Pedidos o cotizaciones con fecha no interpretable permanecen visibles al final de su grupo.

"Hoy" significa "trabajo que requiere atencion ahora"; no filtra exclusivamente por la fecha calendario actual.

### Fila de trabajo

Cada fila muestra solo informacion disponible:

- Tipo de entidad mediante icono.
- Nombre del cliente.
- Sede resuelta desde `sedeId`; fallback honesto si no puede resolverse.
- Contexto principal: producto, motivo o montura/producto.
- Fecha y hora cuando corresponda.
- Estado textual.
- Verbo siguiente: resolver pago, confirmar cita o contactar.

Tap abre el detalle. No hay acciones destructivas ni selects inline en la lista.

## Secciones Operativas

Pedidos, Citas y Cotizaciones comparten un shell de lista con configuracion tipada por entidad.

### Mobile

- Lista continua de filas compactas.
- Busqueda por cliente o telefono.
- Filtro de estado.
- Filtro de sede.
- Filtros en bottom sheet.
- Empty state especifico para combinacion de filtros.

### Desktop

- Tabla densa con columnas que caben en el ancho real.
- El detalle se abre en panel lateral.
- No hay scroll horizontal como comportamiento principal.
- Columnas secundarias pueden ocultarse en tablet; la informacion completa sigue en el detalle.

La busqueda y filtros son locales sobre los arrays cargados en V1. No se requieren endpoints nuevos.

## Detalle y Contacto

### Presentacion

- Mobile: bottom sheet de hasta 88-91% del alto, contenido desplazable y footer de acciones fijo dentro del sheet.
- Desktop: panel lateral con la misma jerarquia.
- El cierre devuelve foco al elemento que lo abrio.
- Escape, backdrop y boton de cierre funcionan de forma accesible.

### Campos por entidad

Pedido:

- Cliente y telefono.
- Sede.
- Producto resuelto desde `productoId`.
- Precio registrado.
- Fecha.
- Estado.

Cita:

- Cliente y telefono.
- Sede.
- Fecha y hora preferidas.
- Motivo.
- Nota.
- Estado.

Cotizacion:

- Cliente y telefono.
- Sede.
- Producto o montura resuelta desde `productoId`.
- OD, OI, astigmatismo OD y astigmatismo OI.
- Extras.
- Total registrado.
- Fecha.
- Estado.

Un id relacionado que ya no resuelva debe mostrarse como "Producto no disponible" o "Sede no disponible", nunca como dato inventado.

### Editor de WhatsApp

1. El admin pulsa "Preparar WhatsApp".
2. Se muestra telefono de cliente, sede y mensaje propuesto.
3. El mensaje es editable localmente.
4. Se explica que el estado no cambiara automaticamente.
5. "Abrir WhatsApp" usa `telefono` del cliente guardado en la entidad, despues de normalizarlo y validarlo para WhatsApp.
6. Volver conserva el detalle.

El texto editado no se persiste porque el backend no dispone de ese campo.

El WhatsApp de la sede identifica el canal comercial del negocio en el storefront; no sustituye el telefono del cliente en el flujo administrativo. Si el telefono del cliente no es utilizable, el boton se deshabilita y explica el problema sin inventar otro destino.

## Cambio de Estado

- Se abre un sheet/panel con todos los estados validos de la entidad.
- Se usa lista de opciones o segmented control, nunca `<select>` mudo.
- El admin selecciona un estado y pulsa "Guardar estado".
- Mientras guarda, el comando queda deshabilitado y muestra progreso textual.
- Exito cierra el selector, actualiza lista/contadores y muestra toast.
- Error mantiene el detalle, revierte el estado visual y ofrece Reintentar.

### Deshacer

El toast de exito ofrece "Deshacer" durante una ventana corta de la sesion. Deshacer ejecuta un segundo PATCH con el estado anterior.

- No crea historial persistente.
- Si falla, informa el error y conserva el estado confirmado por servidor.
- Solo se ofrece para el ultimo cambio reversible disponible en ese contexto.

## Catalogo Administrativo

### Lista

Cada producto muestra:

- Miniatura de `imagenUrl` o fallback profesional de montura.
- Nombre.
- Categoria resuelta.
- Precio.
- Stock.
- Destacado.

Busqueda por nombre y filtro por categoria, stock o destacado pueden resolverse localmente.

### Crear y editar producto

Campos exactos:

- Nombre requerido.
- Categoria requerida.
- Precio numerico no negativo.
- Stock entero no negativo.
- URL de imagen valida o `null`.
- Descripcion.
- Destacado booleano.

La URL muestra preview en vivo. Una imagen que no carga produce feedback junto al campo y conserva el formulario.

Los errores de validacion aparecen junto al campo, el primer error recibe foco al enviar y ningun valor valido se pierde.

### Categorias

- Viven dentro de Catalogo, no en la navegacion principal.
- Se muestran y editan `key`, `label` y `orden`.
- `orden` debe ser entero no negativo.
- El borrado usa confirmacion contextual.

### Borrado

No usar `window.confirm` ni `alert`.

Ejemplo aprobado:

> Eliminar "Montura Classic Pro". El producto dejara de aparecer en el storefront. Esta accion no se puede deshacer.

Acciones: "Conservar" y "Eliminar producto". Rojo se reserva para el comando destructivo.

## Sedes

Lista mobile de superficies compactas y tabla/lista desktop. Cada sede usa solamente:

- Ciudad.
- Direccion.
- Telefono.
- WhatsApp.
- Horario.
- URL de Google Maps.

El formulario valida todos los requeridos y URL de Maps. No crea foto, disponibilidad, stock por sede ni geocodificacion.

Los nombres Barinas, Acarigua y Barquisimeto son contexto comercial verificado, pero la lista renderiza los documentos que devuelve Firestore. El UI no debe fingir que existen documentos faltantes.

## Login

- Correo y contraseña existentes.
- Sin registro.
- Sin recuperacion de contraseña.
- Sin login social.
- Branding OptiBlue sobrio, sin gradiente y sin emoji.
- Error de credenciales dentro del formulario.
- Loading deshabilita el submit y conserva el correo.
- Tras autenticar, mantiene la validacion actual del custom claim admin.

## Estados Transversales

### Loading

- Skeleton con forma del contenido.
- Sin spinner generico como estado principal.
- El layout no cambia de tamaño al llegar los datos.

### Empty

- Fondo neutral.
- Explicacion especifica.
- Accion contextual: limpiar filtros, ir a otra seccion o crear item cuando corresponda.

### Error recuperable

- Superficie blanca con borde neutral y acento rojo estrecho.
- Icono, titulo, explicacion y Reintentar.
- No usar una tarjeta completa rosada/roja.
- Confirmar cuando la informacion anterior no fue modificada.

### Success

- Toast oscuro/neutral con icono de confirmacion.
- Texto breve y accion Deshacer cuando corresponda.
- No usar una pantalla verde completa.

## Componentes Propuestos

```text
components/admin/
  shell/
    AdminShell
    AdminHeader
    DesktopSidebar
    MobileBottomNav
    MoreMenu
  attention/
    AttentionInbox
    AttentionSummary
    AttentionRow
  work/
    WorkListPage
    WorkListToolbar
    WorkListFilters
    WorkRow
    WorkTable
  detail/
    EntityDetail
    EntityDetailSheet
    EntityDetailPanel
    WhatsAppComposer
    StatusEditor
    UndoToast
  catalog/
    AdminCatalog
    ProductList
    ProductEditor
    CategoryManager
  locations/
    LocationList
    LocationEditor
  feedback/
    AdminDataState
    ConfirmDialog
    InlineError
```

Tipos de UI sugeridos:

```ts
type AdminEntityKind = "pedido" | "cita" | "cotizacion";
type LoadState = "idle" | "loading" | "success" | "error";

interface AttentionItem {
  kind: AdminEntityKind;
  id: string;
  clientName: string;
  locationLabel: string;
  contextLabel: string;
  dateLabel: string | null;
  nextActionLabel: string;
  priority: number;
}

interface MutationState {
  status: "idle" | "saving" | "success" | "error";
  message: string | null;
}
```

Las entidades backend existentes siguen siendo la fuente de verdad. `AttentionItem` es un view model derivado, no un documento Firestore.

## Estado y Datos

- Crear un hook/agregador de la bandeja que combine los tres hooks actuales sin duplicar peticiones por cada componente.
- Limpiar errores al iniciar un refetch.
- Actualizar listas y contadores despues de una mutacion confirmada.
- Evitar optimismo silencioso; si se usa actualizacion optimista, debe revertirse al fallar.
- Resolver sedes y productos mediante mapas `id -> entidad` memoizados.
- El boton Actualizar dispara refetch de las tres colecciones operativas.
- No mostrar indicador realtime ni texto "en vivo".

## Responsive

Validacion minima obligatoria:

- 390 x 844 px.
- 768 x 1024 px.
- 1440 x 900 px.

Reglas:

- Cero overflow horizontal.
- Header, contenido y bottom nav ocupan filas separadas.
- Sheets usan `dvh` y safe areas.
- El teclado movil no oculta la accion primaria.
- Texto largo trunca en listas y se muestra completo en detalle.
- Sidebar nunca reduce el contenido hasta romper columnas.
- Desktop cambia a panel o columnas responsivas antes de truncar acciones esenciales.

## Accesibilidad

- Contraste WCAG AA para texto y controles.
- `focus-visible` claro en superficies blancas y navy.
- Estado expresado con texto mas icono/forma, no solo color.
- Dialogs y sheets con `role="dialog"`, titulo asociado, focus trap y retorno de foco.
- Toast de resultado con `aria-live="polite"`; errores bloqueantes con anuncio apropiado.
- Botones icon-only con nombre accesible y tooltip cuando no sean obvios.
- Acciones destructivas requieren contexto textual completo.
- Respetar `prefers-reduced-motion`.

## Motion

- Sheet: 180-220 ms con translate vertical y fade del backdrop.
- Panel lateral: 160-200 ms.
- Toast: entrada breve sin rebote.
- Hover desktop: borde/elevacion discreta, no cambio de opacidad aislado.
- Sin animacion decorativa continua.

## Estrategia de Pruebas

Unitarias:

- Derivacion de elementos accionables.
- Orden de prioridad con fechas validas e invalidas.
- Mapeo de estados a tono e icono.
- Filtrado por texto, sede y estado.
- Generacion de mensajes WhatsApp por entidad.
- Validacion de producto, categoria y sede.

Componentes:

- Loading, error, empty y success.
- Apertura/cierre de sheet y retorno de foco.
- Estado no cambia al abrir WhatsApp.
- Guardar estado, error y Reintentar.
- Deshacer ejecuta PATCH al estado anterior.
- Confirmacion contextual de borrado.
- Login sin enlaces de registro o recuperacion.

E2E responsive:

- Hoy -> detalle -> WhatsApp -> estado -> deshacer.
- Busqueda y filtros en cada seccion.
- Crear/editar/borrar producto.
- Editar sede.
- Navegacion mobile y desktop.
- Screenshots y comprobacion de overflow en 390, 768 y 1440 px.

## Criterios de Aceptacion

- [ ] En 390 px el dueño identifica pendientes y siguiente accion en menos de tres segundos.
- [ ] "Hoy" contiene solo estados realmente accionables y respeta la prioridad aprobada.
- [ ] No aparece ningun claim de no leido, tiempo relativo o realtime inexistente.
- [ ] Navegacion movil tiene cinco items y no se superpone al contenido.
- [ ] Mobile usa filas/cards escaneables; desktop usa tabla densa sin overflow horizontal.
- [ ] Detalle muestra todos y solo los campos reales de cada entidad.
- [ ] WhatsApp permite editar el mensaje y no cambia estado automaticamente.
- [ ] Cambio de estado es explicito, informa exito/error y permite deshacer inmediato.
- [ ] Productos validan precio, stock, URL y muestran preview.
- [ ] Categorias y sedes se gestionan con sus campos reales.
- [ ] No existen `confirm()` ni `alert()` nativos.
- [ ] Login mantiene correo/contraseña, claim admin y no inventa recuperacion o registro.
- [ ] Cero emojis en el back office.
- [ ] Color cotidiano es neutral; ambar y azul son señales pequeñas; rojo y verde quedan reservados.
- [ ] Loading usa skeleton; empty y error siempre ofrecen contexto y accion.
- [ ] Se valida visualmente en 390, 768 y 1440 px.
- [ ] Build, typecheck, pruebas y auditoria de dependencias pasan antes del deploy.

## Referencias Externas

- Shopify Polaris, Color: https://polaris-site-prod-kit.shopify.prod.shopifyapps.com/design/colors
- Shopify Polaris, Badge: https://polaris-react.shopify.com/components/feedback-indicators/badge
- Square, Fulfill orders: https://squareup.com/help/us/en/article/6923/pickup-orders-on-square-point-of-sale
- Shopify mobile admin: https://help.shopify.com/en/manual/shopify-admin/shopify-app
- RevolutionEHR: https://www.revolutionehr.com/
- Luceon: https://luceon.app/

Estas referencias aportan patrones de operacion, densidad y semantica. No autorizan copiar su identidad visual ni ampliar el alcance funcional de OptiBlue.
