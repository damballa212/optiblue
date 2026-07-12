# OptiBlue - Plan de implementacion UX/UI storefront publico

Fecha: 2026-07-11  
Repo: `/Users/marlon/Documents/trae_projects/optiblue/optiblue-web`  
Base de investigacion: `UX-UI-AUDIT-RESEARCH.md`  
Alcance: storefront publico cliente. El admin solo se toca cuando afecte carga, seguridad percibida o documentacion.

## Estado inicial verificado

- Frontend: React 19 + TypeScript 7 + Vite + React Router.
- Backend/Firebase ya existe y esta en produccion para catalogo, sedes, pedidos, citas, cotizaciones y auth.
- Produccion actual: `https://optiblue-prod.web.app`.
- Issues backend principales ya cerrados: MAR-99, MAR-100, MAR-101, MAR-102, MAR-105, MAR-106.
- Bloqueos externos activos:
  - MAR-103: catalogo real desde Excel.
  - MAR-104: datos reales de sedes.
- Auditoria previa creada en `UX-UI-AUDIT-RESEARCH.md`.

## Contrato backend V1 verificado

Fuente: lectura completa de `/Users/marlon/Documents/trae_projects/optiblue/optiblue-backend` el 2026-07-11. Tests: `pnpm test` pasa 25/25 contra Firestore/Auth emulators. Warning observado: la sesion local usa Node 26.5.0 y el backend declara Node 24.

Colecciones publicamente legibles por Firestore Rules:

- `productos`
- `categorias`
- `sedes`
- `servicios`

Colecciones privadas, solo via Cloud Functions/Admin SDK:

- `pedidos`
- `citas`
- `cotizaciones`

Campos reales V1:

Producto:

- `id`
- `nombre`
- `categoriaId`
- `precio`
- `imagenUrl`
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

Pedido:

- `id`
- `nombre`
- `telefono`
- `sedeId`
- `productoId`
- `precio`
- `estado`: `pendiente | pagado | no_pagado`
- `fecha`

Cita:

- `id`
- `nombre`
- `telefono`
- `sedeId`
- `fecha`
- `hora`
- `motivo`
- `estado`: `pendiente | confirmada | completada | cancelada`
- `nota`

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
- `estado`: `pendiente | contactado | cerrada`
- `fecha`

Fuera del modelo V1 actual:

- marca
- color
- material
- medidas
- forma
- variantes/swatches
- fotos multiples por producto
- disponibilidad por sede
- politicas de garantia/devolucion/retiro
- claims verificables como rating Google, anos de experiencia o cantidad de modelos
- Cashea como entidad/dato estructurado
- promociones como entidad/dato estructurado
- calendario real de disponibilidad/slots
- carrito multi-producto
- pasarela de pago

Regla de alcance: si una UI necesita campos fuera de este contrato, no se implementa como feature V1. Se puede mostrar solo como copy/asset estatico verificado, o se crea un issue separado de ampliacion de modelo antes de tocar frontend.

## Principio de direccion

No se va a "maquillar" la UI actual. La direccion correcta es reconstruir la experiencia publica como:

**optica comercial local con presencia social fuerte + confianza clinica + promociones visibles**.

Esta direccion se ajusto despues de revisar manualmente dos capturas del Instagram real `optiblue_` aportadas por Marlon. No se uso OCR ni fuente externa para esa lectura.

Codigos visuales visibles del Instagram:

- Navy / azul oscuro institucional para highlights e iconos.
- Azul claro pastel como fondo frecuente de posts promocionales.
- Blanco bold para titulares grandes sobre foto o fondos pastel.
- Azul electrico / royal blue para acentos de promociones como `60%`.
- Celeste del logo para detalles suaves.
- Fotos reales de personas, asesores/modelos, personal clinico, monturas y espacios de tienda.
- Mensajes comerciales visibles: Cashea, promos, porcentajes, monturas disponibles y marcas.

Reglas de decision:

- No inventar sedes, ratings, anos de experiencia, cantidad de modelos ni marcas.
- No usar emojis como sustituto de producto, iconografia profesional o assets reales.
- No copiar templates de GitHub como base visual principal.
- Usar benchmarks como patrones UX, no como identidad.
- Usar el Instagram real como fuente de identidad visual, pero ordenarlo para web.
- Priorizar mobile: trafico probable desde WhatsApp/Instagram.
- La primera pantalla debe probar que OptiBlue es una optica real, no una demo.

## Linear

Proyecto: [OptiBlue](https://linear.app/marlondev/project/optiblue-ead02e291f64)

Issues creados para esta implementacion:

| Fase | Linear | Estado actual | Prioridad | Dependencias |
|---|---|---|---|---|
| 0 | [MAR-107](https://linear.app/marlondev/issue/MAR-107/storefront-publico-corregir-confianza-basica-nav-mobile-y-estados) | Done | High | ninguna |
| 1 | [MAR-108](https://linear.app/marlondev/issue/MAR-108/storefront-publico-preparar-datos-assets-y-contenido-real-para) | In Progress | High | MAR-103, MAR-104 |
| 2 | [MAR-109](https://linear.app/marlondev/issue/MAR-109/storefront-publico-redisenar-home-y-sistema-visual-comercialsocial) | Done | High | MAR-107 |
| 3 | [MAR-110](https://linear.app/marlondev/issue/MAR-110/catalogo-publico-filtros-profesionales-detalle-de-producto-y-cards) | Done | High | MAR-103, MAR-107 |
| 4 | [MAR-111](https://linear.app/marlondev/issue/MAR-111/flujos-publicos-reducir-friccion-de-reserva-cotizacion-y-citas) | Done | High | MAR-107 |
| 5 | [MAR-112](https://linear.app/marlondev/issue/MAR-112/storefront-publico-performance-seo-basico-y-documentacion-post) | Done | Medium | MAR-107 |

## Dependencias practicas

Orden recomendado:

1. Fase 0 primero, siempre.
2. Fase 1 puede avanzar en paralelo con pedidos a Carlos/cliente, pero no debe desbloquear copy o assets inventados.
3. Fase 2 puede hacerse con placeholders profesionales si se documenta que assets finales quedan bloqueados.
4. Fase 3 depende mucho de MAR-103; sin Excel/catalogo real solo se puede construir estructura y seed representativo.
5. Fase 4 puede avanzar despues de Fase 0 porque los flujos ya existen.
6. Fase 5 cierra cuando el rediseño este implementado o al menos estabilizado.

## Fase 0 - Confianza basica, mobile nav y estados publicos

Linear: [MAR-107](https://linear.app/marlondev/issue/MAR-107/storefront-publico-corregir-confianza-basica-nav-mobile-y-estados)

Objetivo: eliminar errores que hacen que el storefront parezca demo o informacion falsa antes de redisenar.

Estado 2026-07-11: implementada y verificada localmente. Queda fuera de esta fase completar datos reales de sedes/catalogo; los valores `Por definir` observados vienen de datos actuales y no se reemplazaron con contenido inventado.

Checklist:

- [x] Revisar `src/components/home/Hero.tsx`.
- [x] Eliminar o corregir ciudades incorrectas del hero.
- [x] Usar copy neutro si las sedes reales todavia no tienen datos completos.
- [x] Revisar claims `+500 modelos`, `15 anos de experiencia`, `4.9 en Google`.
- [x] Quitar claims no verificados o marcarlos para contenido real.
- [x] Ocultar `Panel` de la navegacion publica.
- [x] Definir acceso admin por URL directa `/admin` o flujo interno, no como CTA cliente.
- [x] Crear navegacion mobile real.
- [x] Verificar que no haya overflow horizontal en 390px.
- [x] Agregar manejo de loading/error en `useProductos`.
- [x] Agregar manejo de loading/error en `useCategorias`.
- [x] Agregar manejo de loading/error en `useSedes`.
- [x] Mostrar loading state en home.
- [x] Mostrar loading/error/empty state en catalogo.
- [x] Mostrar loading/error/empty state en sedes.
- [x] Revisar que footer no dependa silenciosamente de sedes vacias.

Criterios de aceptacion:

- [x] Mobile 390px muestra toda la navegacion sin cortar texto.
- [x] Ninguna ruta publica muestra `Panel`.
- [x] No hay ciudades falsas en hero/home/footer.
- [x] Estados vacios distinguen entre carga, error y ausencia real de datos.
- [x] `npm run build` pasa.

Verificacion:

- [x] Captura `/` desktop 1440px.
- [x] Captura `/` mobile 390px.
- [x] Captura `/catalogo` desktop 1440px.
- [x] Captura `/catalogo` mobile 390px.
- [x] Captura `/sedes` mobile 390px.

## Fase 1 - Datos, assets y contenido real dentro de V1

Linear: [MAR-108](https://linear.app/marlondev/issue/MAR-108/storefront-publico-preparar-datos-assets-y-contenido-real-para)

Objetivo: reunir o bloquear explicitamente lo que la UI V1 puede usar sin ampliar el backend. No se deben pedir ni prometer campos que el modelo actual no soporta.

Estado 2026-07-11: contrato de contenido V1 creado en `UX-UI-CONTENT-CONTRACT-V1.md`. Se verifico que no hay Excel/CSV ni assets reales de producto en el repo/Downloads; MAR-103 sigue Backlog y MAR-104 sigue In Progress con datos de sedes incompletos. Cashea/promos/marcas/claims quedan bloqueados hasta confirmacion explicita del cliente/Carlos.

Checklist:

- [x] Confirmar estado de MAR-103: Backlog, bloqueado por Excel/catalogo real del cliente.
- [x] Confirmar estado de MAR-104: In Progress, bloqueado por datos reales de sedes.
- [x] Revisar manualmente las capturas/posteos disponibles de Instagram como referencia visual.
- [x] Definir imagen principal por producto (`imagenUrl`) o fallback visual profesional.
- [x] No exigir fotos multiples por producto: el backend V1 solo soporta una `imagenUrl`.
- [x] Definir campos del catalogo real soportados por V1:
  - [x] nombre
  - [x] categoriaId/categoria
  - [x] precio
  - [x] imagenUrl
  - [x] descripcion
  - [x] stock
  - [x] destacado
- [x] Confirmar categorias reales como registros `categorias` (`key`, `label`, `orden`).
- [x] Definir campos de sedes soportados por V1:
  - [x] ciudad
  - [x] direccion
  - [x] telefono
  - [x] WhatsApp
  - [x] horario
  - [x] link Maps
- [x] Confirmar si Cashea debe mostrarse como bloque/copy estatico de V1: no confirmado; no mostrar hasta confirmacion.
- [x] Confirmar si hay promociones vigentes como bloque/copy estatico de V1: no confirmado; no mostrar hasta confirmacion.
- [x] Confirmar claims visibles solo si hay evidencia: no hay evidencia suficiente; no mostrar claims numericos/politicas.
- [x] Marcar como fuera de V1 cualquier necesidad de marca/color/material/medidas/forma/variantes/disponibilidad por sede.
- [x] Documentar que queda bloqueado por cliente/Carlos y que queda fuera por modelo V1.

Criterios de aceptacion:

- [x] El rediseño puede implementarse sin inventar informacion ni ampliar el backend de forma implicita.
- [x] Los placeholders que queden tienen razon explicita.
- [x] MAR-103 y MAR-104 quedan enlazados como bloqueos donde corresponda.
- [x] Ningun checklist de V1 exige marca/color/material/medidas/politicas/claims como datos estructurados.

Verificacion:

- [x] Checklist cruzado contra MAR-103.
- [x] Checklist cruzado contra MAR-104.
- [x] No marcar Done si datos reales siguen ausentes sin nota de bloqueo.

## Fase 2 - Home y sistema visual comercial/social + clinica

Linear: [MAR-109](https://linear.app/marlondev/issue/MAR-109/storefront-publico-redisenar-home-y-sistema-visual-comercialsocial)

Objetivo: reemplazar la apariencia generica por una primera impresion profesional, local, comercial y confiable, alineada con el Instagram real de OptiBlue.

Estado 2026-07-11: implementada y verificada contra los mockups aprobados. Se usa un fallback geometrico optico honesto porque todavia no existen fotos reales en el repo; sustituirlo por fotografia aprobada sigue bloqueado por MAR-108. Cashea y promociones se evaluaron y se omitieron porque no hay vigencia confirmada.

Checklist:

- [x] Definir moodboard/direccion visual basada en Instagram + benchmarks, no en templates.
- [x] Definir paleta final basada en navy, azul pastel, blanco, azul electrico y celeste del logo.
- [x] Definir tipografia de headings y body: Space Grotesk Variable + DM Sans Variable, servidas localmente.
- [x] Definir escala tipografica.
- [x] Definir spacing/breakpoints.
- [x] Definir tratamiento de botones, inputs, cards y modales.
- [x] Redisenar hero.
- [x] Hero usa fallback optico profesional y honesto.
- [x] Hero tiene una propuesta concreta, no copy generico.
- [ ] Reemplazar fallback por rostro/producto/tienda/personal real: bloqueado por falta de assets reales en MAR-108; no se uso stock.
- [x] Agregar bloque de confianza basado en proceso verificable, sin claims numericos.
- [x] Evaluar Cashea: omitido porque no esta confirmado como vigente.
- [x] Evaluar promociones: omitidas porque no hay promociones vigentes confirmadas.
- [x] Agregar bloque de servicios con jerarquia clara.
- [x] Agregar bloque de sedes con senal local.
- [x] Agregar bloque de asesoria si el usuario no sabe que elegir.
- [x] Eliminar emojis del storefront publico y usar Lucide/fallbacks opticos.
- [x] Revisar footer para que parezca institucional, no template.
- [x] Verificar responsive en desktop/tablet/mobile.

Criterios de aceptacion:

- [x] El primer viewport muestra una direccion visual profesional conectada al Instagram sin inventar fotografia.
- [x] La paleta se reconoce como OptiBlue: navy + azul pastel + blanco bold + acentos azul electrico/celeste.
- [x] No domina un gradiente azul generico.
- [x] La home comunica opciones, sedes y proximo paso con datos V1.
- [x] No hay solapes, texto cortado ni scroll horizontal en mobile.

Verificacion:

- [x] `npm run build`.
- [x] Capturas `/` en 1440px, 1024px, 768px y 390px.
- [x] Revision visual manual contra los tres mockups aprobados y `UX-UI-AUDIT-RESEARCH.md`.

## Fase 3 - Catalogo profesional

Linear: [MAR-110](https://linear.app/marlondev/issue/MAR-110/catalogo-publico-filtros-profesionales-detalle-de-producto-y-cards)

Objetivo: que el catalogo ayude a elegir lentes, no solo listar productos.

Estado 2026-07-11: implementada y verificada con el seed V1 del emulador. MAR-103 sigue pendiente para sustituir el seed por catalogo real, pero no bloquea la estructura terminada. Se probaron `imagenUrl` nula y fallida; ambas muestran fallback profesional.

Checklist:

- [x] Validar estructura de MAR-103 y usar seed representativo temporal con los campos V1.
- [x] No mostrar marcas vistas en Instagram como dato de producto.
- [x] Definir atributos filtrables reales dentro del modelo V1.
- [x] Redisenar barra de filtros desktop y sheet mobile.
- [x] Agregar filtros por categoria.
- [x] Agregar filtros por precio.
- [x] Agregar filtros por destacado y stock.
- [x] No agregar filtros por color/material/forma/marca en V1.
- [x] Redisenar product card.
- [x] Card muestra `imagenUrl` o fallback profesional cuando falta/falla.
- [x] Card muestra precio de forma clara.
- [x] Card muestra solo atributos reales V1: nombre, categoria, precio, descripcion corta, stock/destacado.
- [x] Card muestra stock general sin prometer disponibilidad por sede.
- [x] Crear detalle modal con ruta `/catalogo/:productoId`.
- [x] Detalle muestra solo campos V1: imagenUrl, nombre, categoria, descripcion, precio, stock, destacado.
- [x] CTA diferencia:
  - [x] consultar disponibilidad
  - [x] apartar en sede
  - [x] cotizar con formula
- [x] Empty state ofrece accion a sedes/asesoria.

Criterios de aceptacion:

- [x] El usuario entiende que producto esta viendo y que hacer despues.
- [x] No se renderiza emoji como producto.
- [x] Los filtros no inventan atributos inexistentes.
- [x] No se agregan campos nuevos al modelo solo para sostener la UI.
- [x] Mobile permite filtrar sin romper layout.

Verificacion:

- [x] `npm run build`.
- [x] Capturas `/catalogo` desktop/mobile, filtros mobile y detalle mobile.
- [x] Probar `ProductImage` con URL, URL fallida y sin URL mediante Vitest.
- [x] Probar categorias vacias y catalogo vacio contra Firestore emulator; seed restaurado al terminar.

## Fase 4 - Conversion: reserva, cotizacion y citas

Linear: [MAR-111](https://linear.app/marlondev/issue/MAR-111/flujos-publicos-reducir-friccion-de-reserva-cotizacion-y-citas)

Objetivo: reducir friccion y hacer honestos los flujos que terminan en WhatsApp.

Estado 2026-07-11: implementada y verificada contra emuladores locales. Decision: Google login deja de ser obligatorio en conversion publica; nombre/telefono + registro backend es suficiente para V1. Si la sede no tiene WhatsApp real configurado, el flujo registra la solicitud y muestra confirmacion honesta en vez de abrir `wa.me/Por definir`.

Checklist:

- [x] Auditar `ReservaModal`.
- [x] Auditar `PageLentes`.
- [x] Auditar `AgendarCitaModal`.
- [x] Auditar `GoogleAuthGate`.
- [x] Decidir si Google login es obligatorio, opcional o removido: removido de conversion publica.
- [x] Si se mantiene login, explicar el valor para el cliente: no aplica, no se mantiene en conversion publica.
- [x] Si se vuelve opcional, permitir continuar con nombre/telefono.
- [x] Mejorar microcopy antes de abrir WhatsApp.
- [x] Agregar confirmacion visual de registro cuando aplique.
- [x] Mejorar errores de backend/red.
- [x] Revisar flujo "no tengo receta".
- [x] Cambiar "agendar" por "solicitar cita" si no hay disponibilidad real.
- [x] Evitar prometer slots reales sin calendario real.
- [x] Validar mobile: teclado, scroll, botones y modales.

Criterios de aceptacion:

- [x] El usuario entiende por que se piden datos.
- [x] El flujo no bloquea conversion sin razon de negocio.
- [x] WhatsApp se abre con mensaje correcto cuando hay numero valido; si falta, se registra y muestra confirmacion.
- [x] Backend registra pedido/cita/cotizacion antes de abrir WhatsApp cuando aplique.
- [x] No hay modales incomodos en mobile.

Verificacion:

- [x] Probar reserva desde catalogo.
- [x] Probar cotizacion completa.
- [x] Probar cita desde lentes sin receta.
- [x] Probar cita desde servicios.
- [x] Revisar backend local: pedidos/cotizaciones/citas registrados en Firestore emulator.

## Fase 5 - Performance, SEO y documentacion

Linear: [MAR-112](https://linear.app/marlondev/issue/MAR-112/storefront-publico-performance-seo-basico-y-documentacion-post)

Objetivo: cerrar el rediseño con carga razonable, metadata y documentacion real.

Estado 2026-07-11: implementada y verificada en build/preview local. Admin, Auth y paginas publicas se separaron por carga diferida; Firestore se mantiene en el storefront porque home, catalogo, sedes y footer consumen lecturas reales. La entrada monolitica de `845.88 kB` se reemplazo por chunks menores; el mayor es `231.42 kB` y el build ya no genera warning de 500 kB. LocalBusiness/Optician se difiere hasta completar MAR-104 y Product hasta completar MAR-103. No hay decisiones visuales finales que documentar hasta ejecutar la fase 2.

Checklist:

- [x] Revisar bundle generado por `npm run build`.
- [x] Separar admin con lazy loading/code splitting si aplica.
- [x] Separar rutas pesadas si aplica.
- [x] Revisar carga de Firebase/Auth en storefront publico.
- [x] Agregar lazy loading de imagenes.
- [x] Agregar dimensiones/ratio estables para imagenes.
- [x] Revisar `index.html` metadata.
- [x] Definir title/description del sitio.
- [x] Evaluar structured data LocalBusiness/Optician: diferido hasta completar datos reales de sedes en MAR-104.
- [x] Evaluar structured data Product: diferido hasta completar catalogo real en MAR-103.
- [x] Actualizar `README.md`.
- [x] README debe reflejar:
  - [x] Firebase real
  - [x] Auth real
  - [x] Router real
  - [x] Produccion
  - [x] Pendientes reales MAR-103/MAR-104
  - [x] Como correr build/preview
- [x] Documentar decisiones visuales finales en `docs/superpowers/specs/2026-07-11-optiblue-storefront-redesign-design.md`.

Criterios de aceptacion:

- [x] `npm run build` pasa.
- [x] No quedan warnings criticos sin explicacion.
- [x] README no contradice el codigo ni Obsidian.
- [x] El storefront no carga innecesariamente todo el admin en la primera pantalla si se puede evitar.

Verificacion:

- [x] Build local.
- [x] Preview local.
- [x] Smoke test en rutas publicas y `/admin/login` a 390x844.
- [x] Revisar git diff antes de PR.

## Checklist maestro

- [x] MAR-107 cerrado.
- [ ] MAR-108 cerrado o bloqueos externos documentados.
- [x] MAR-109 cerrado.
- [x] MAR-110 cerrado; MAR-103 queda como sustitucion de seed por catalogo real, no como bloqueo de UI.
- [x] MAR-111 cerrado.
- [x] MAR-112 cerrado.
- [x] Obsidian actualizado con decisiones durables.
- [x] Daily actualizada al cerrar la sesion de implementacion.
- [ ] Commit/PR no solicitado en esta sesion; el worktree se entrega verificado sin publicar.

## No hacer sin nueva decision

- [x] No clonar template de GitHub como base visual.
- [x] No inventar productos, sedes, marcas o ratings.
- [x] No agregar pasarela de pago.
- [x] No construir virtual try-on.
- [x] No redisenar admin completo dentro de esta fase.
- [x] No mover issues a Done con AC sin marcar/verificar.
