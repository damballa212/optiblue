# OptiBlue - Auditoria UX/UI e investigacion de referencias

Fecha: 2026-07-11  
Alcance: frontend publico del repo `/Users/marlon/Documents/trae_projects/optiblue/optiblue-web`  
Estado: investigacion solamente. No se modifico UI, codigo, datos ni Linear.

## Resumen ejecutivo

La UI publica actual no comunica la marca real que se ve en Instagram: optica comercial local, social, con confianza clinica y promociones visibles. El problema no es solo que "se vea generica": hay fallos objetivos de UX que afectan confianza, conversion y operacion.

Hallazgos mas graves:

- El hero dice Caracas, Valencia y Maracaibo, pero Obsidian/backend seed indican Barinas, Acarigua y Barquisimeto. Eso rompe confianza de inmediato.
- La navegacion mobile se corta horizontalmente; no hay menu mobile.
- Catalogo/home pueden quedar vacios sin loading/error state util. Visualmente aparece una seccion rota.
- El sitio usa emojis como producto/iconografia principal, sin fotos reales, sin fachada, sin personas, sin marcas, sin prueba social verificable.
- El link `Panel` aparece en la navegacion publica del cliente. Aunque este protegido, no deberia estar en el storefront.
- La propuesta visual es un patron SaaS generico: gradiente azul, cards blancas, pills, Inter, poco caracter optico/local/comercial y poca relacion con el Instagram real.
- El catalogo no ayuda a elegir lentes: faltan forma, material, color, ancho, medidas, disponibilidad, marca, tipo de lente compatible, fotos por variante y pagina detalle.

Mi criterio: no conviene "arreglar colores" encima de esto. La direccion correcta es redisenar el storefront publico con una arquitectura de conversion y confianza, manteniendo el backend ya construido y alineando la visual con el Instagram real de OptiBlue.

## Evidencia revisada

### Obsidian

- `01 - Trabajo/Proyectos/OptiBlue/OptiBlue.md`
- `01 - Trabajo/Proyectos/OptiBlue/contexto.md`
- `01 - Trabajo/Proyectos/OptiBlue/Reuniones/2026-07-10 - Planificacion backend y modelo de negocio.md`
- `01 - Trabajo/Proyectos/OptiBlue/Decisiones/2026-07-11 - Arquitectura backend Firebase - lecturas directas, escrituras por Functions.md`
- `05 - Daily/2026-07-11.md`

Contexto verificado desde Obsidian:

- OptiBlue es una optica real, high ticket, orientada a publico clase media-alta.
- Sedes reales actuales: Barinas, Acarigua y Barquisimeto. Valencia queda como sede futura.
- Produccion: `https://optiblue-prod.web.app`.
- Backend y flujos v1 ya existen: catalogo, sedes, pedidos, citas, cotizaciones, auth y deploy.
- Pendientes reales externos: datos completos de sedes y catalogo real desde Excel.

### Linear

Solo discovery, sin modificar:

- Proyecto Linear existente: OptiBlue.
- Issues relevantes:
  - MAR-103: catalogo real desde Excel, backlog.
  - MAR-104: datos reales de sedes, in progress.
  - MAR-99, MAR-100, MAR-101, MAR-102, MAR-105, MAR-106: done.

### Repo local

Archivos y comportamiento revisados:

- `src/App.tsx`: router real con rutas publicas y `/admin/*`.
- `src/components/home/Hero.tsx`: hero, claims, CTAs y ciudades.
- `src/components/layout/NavBar.tsx`: nav publica con link visible a admin.
- `src/components/catalogo/PageProductos.tsx`, `ProductCard.tsx`, `ReservaModal.tsx`: catalogo, cards y reserva.
- `src/components/lentes/PageLentes.tsx`: wizard de cotizacion.
- `src/components/shared/GoogleAuthGate.tsx`: gate de login Google para reservar/cotizar/agendar.
- `src/components/shared/AgendarCitaModal.tsx`: flujo de citas.
- `src/components/sedes/PageSedes.tsx`: sedes.
- `src/hooks/useProductos.ts`, `useCategorias.ts`, `useSedes.ts`: lectura Firestore directa sin estado de error.
- `src/styles/tokens.ts`, `src/styles/shared.ts`: sistema visual.
- `README.md`: desactualizado frente al estado actual del codigo.

Verificacion:

- `npm run build` pasa.
- Build genera warning: chunk JS `841.87 kB` minificado, `250.30 kB` gzip. Hay riesgo de performance por cargar demasiado en el bundle publico.
- Capturas locales con `vite preview`:
  - `/tmp/optiblue-home-desktop.png`
  - `/tmp/optiblue-catalogo-desktop.png`
  - `/tmp/optiblue-lentes-desktop.png`
  - `/tmp/optiblue-home-mobile.png`
  - `/tmp/optiblue-catalogo-mobile.png`

### Instagram real revisado desde capturas

Fuente: dos capturas aportadas por Marlon el 2026-07-11. Analisis manual visual, sin OCR ni fuente externa.

Datos visibles:

- Usuario: `optiblue_`.
- Nombre visible: `Optiblue | Optica y Oftalmologia`.
- Bio visible: `Optica y Oftalmologia`, `!Nos alegra verte!` con corazon azul.
- Sedes visibles: Barinas, Acarigua, Barquisimeto.
- Link visible: `beacons.ai/optiblue`.
- Metricas visibles en captura: 325 publicaciones, 37.8 mil seguidores, 192 seguidos.
- Highlights visibles: Cashea, Ubicacion, Horario, Servicios.
- CTAs visibles de Instagram: Seguir, Mensaje.

Paleta visible:

- Navy / azul oscuro institucional en highlights e iconos circulares. Aproximado visual: `#002D63` a `#003B7A`.
- Azul claro pastel en fondos de posts promocionales. Aproximado visual: `#CFE5EC` a `#D7EEF3`.
- Blanco para tipografia grande y textos promocionales.
- Azul electrico / royal blue para acentos tipo `60%` y elementos de accion. Aproximado visual: `#1F5BFF` a `#2F6BFF`.
- Celeste del logo y acentos suaves. Aproximado visual: `#54BFE8`.
- Negro/gris oscuro en piezas puntuales de contraste.
- Tonos piel, interiores claros y luces de tienda por fotografia real, no como color principal de sistema.

Senales de contenido visibles:

- Cashea es un mensaje importante: aparece como primer highlight y en post `TENEMOS CASHEA!`.
- Hay promocion fuerte: piezas con `PROMO`, `60%`, `TOP 3`, `5 monturas disponibles`.
- Hay marcas visibles o mencionadas en piezas: Ray-Ban, Ray-Ban Meta y Gucci. Esto debe verificarse contra catalogo real antes de usarlo en web.
- El contenido usa rostros humanos, asesores/modelos, personal clinico con bata, monturas reales y espacios de tienda.
- El tono visual es social/comercial, no lujo silencioso: tipografia grande, uppercase, blanco sobre foto, videos/reels y promos directas.

Correccion de direccion derivada:

La direccion ya no debe describirse como solo "optica boutique local + clinica visual confiable". Con la evidencia de Instagram, la formulacion mas fiel es:

**Optica comercial local con presencia social fuerte + confianza clinica + promociones visibles.**

La web no debe copiar el ruido de Instagram, pero si debe capturar sus codigos: azul pastel, navy, blanco bold, producto real, rostro humano, sedes reales, Cashea/promos y CTA directo a WhatsApp.

## Diagnostico UX por severidad

### Critico - confianza y veracidad

1. Ciudades incorrectas en el hero.

   En `Hero.tsx`, el copy dice "Caracas, Valencia y Maracaibo". Obsidian y `optiblue-backend/scripts/seed.ts` indican Barinas, Acarigua y Barquisimeto. Para una optica local, ciudad/sede es informacion de confianza primaria. No es detalle menor.

2. Claims no verificados en codigo/contexto.

   El hero muestra:

   - `+500 modelos`
   - `15 anos de experiencia`
   - `4.9 en Google`

   No encontre evidencia en repo/Obsidian que verifique esos claims. Si son reales, deben respaldarse con datos o enlaces. Si no lo son, deben quitarse. En salud visual, claims falsos o inventados dan apariencia de template.

3. Link admin visible para clientes.

   `NavBar.tsx` muestra `Panel` en la navegacion publica. Esto no aporta nada al cliente y comunica que el sitio sigue siendo una demo interna. Debe estar oculto o accesible por URL directa/backoffice, no como item del storefront.

4. Catalogo vacio sin diagnostico visible.

   `useProductos`, `useCategorias` y `useSedes` devuelven `loading`, pero las paginas publicas casi no lo usan. Tampoco manejan `onSnapshot` error callback. Resultado visible: home/catologo muestran vacios grandes o "No hay productos" aunque puede ser carga, permiso, red, data ausente o error.

### Alto - conversion

5. Mobile nav rota.

   En 390px de ancho la navegacion se corta: "Lentes adaptados" sale fuera del viewport y no hay menu hamburguesa. Esto afecta la experiencia principal porque el publico probablemente llegue desde WhatsApp/Instagram en movil.

6. Home sin propuesta visual concreta.

   El primer viewport no muestra producto real, rostro, fachada, equipo, examen visual, marcas ni lentes. Solo gradiente azul y texto generico. El Instagram real si muestra personas, monturas, tienda, personal clinico, promociones y Cashea; la web deberia heredar esa evidencia visual con mas orden.

7. Catalogo no permite decidir.

   Hoy los filtros son solo categorias. En eyewear profesional, la decision ideal podria necesitar:

   - forma de montura
   - ancho/talla
   - color
   - material
   - tipo de uso
   - genero/estilo si aplica
   - compatibilidad con formula/progresivos
   - marca
   - disponibilidad por sede
   - fotos reales por variante

   Pero el backend V1 no soporta marca/color/material/medidas/forma/variantes/disponibilidad por sede. Para V1, el catalogo debe mejorar sin inventar esos campos: categorias reales, precio, descripcion, stock, destacado, imagen principal y CTAs claros.

8. Cards de producto insuficientes.

   `ProductCard.tsx` muestra nombre, descripcion, precio y boton reservar. Falta informacion de fit y confianza. Si no hay `imagenUrl`, renderiza emoji. Para high ticket esto baja percepcion de valor.

9. Login Google justo antes de convertir.

   `GoogleAuthGate` obliga a iniciar sesion para reservar/cotizar/agendar. Tecnicamente puede tener sentido para tracking, pero UX comercialmente es friccion fuerte. En un flujo local por WhatsApp deberia evaluarse:

   - pedir datos primero y luego WhatsApp sin login obligatorio, o
   - ofrecer Google como opcion rapida, no barrera, o
   - explicar claramente por que se pide login.

10. Flujo de citas sin disponibilidad real.

   `AgendarCitaModal` usa inputs nativos de fecha/hora, no calendario de disponibilidad. Si no existe disponibilidad real, la UI no deberia prometerla. Debe decir "solicitar cita" o conectarse a slots reales.

### Medio - claridad, accesibilidad y mantenimiento

11. `README.md` esta desactualizado.

   El README dice que no hay backend, no hay auth y que las sedes son Caracas/Valencia/Maracaibo. El codigo ya tiene Firebase, auth, router y produccion. Esto confunde a cualquier agente/desarrollador y puede inducir cambios equivocados.

12. Navegacion usa botones para routing publico.

   `NavBar.tsx` usa `<button>` para cambiar rutas publicas y un `<div>` clickable para el logo. Funciona, pero semantica/accesibilidad/SEO seria mejor con links reales para navegacion.

13. No hay estados de carga profesionales.

   Faltan skeletons, empty states accionables, error states, retry y mensajes especificos.

14. Falta arquitectura de contenido.

   No hay seccion fuerte de:

   - quienes son
   - equipo/especialistas
   - garantia
   - marcas
   - proceso de compra
   - como funciona la receta
   - entregas/retiro
   - resenas verificables
   - ubicacion con fotos

15. Bundle inicial grande.

   El build produce un chunk grande. Probable causa: admin, Firebase/Auth y storefront juntos. Conviene code splitting por rutas, especialmente admin.

## Diagnostico UI design

### Lo que existe hoy

Sistema visual:

- Paleta: navy/blue casi dominante.
- Tipografia: Inter/system.
- Componentes: cards blancas, pills, botones azules, gradiente azul.
- Iconografia: emojis.
- Imagenes: ausentes o opcionales via `imagenUrl`.
- Layout: secciones centradas max-width 1100, grids auto-fill.

### Por que se ve generico

- No hay assets reales.
- No hay textura de marca ni direccion fotografica.
- El azul domina todo y no hay una paleta secundaria sofisticada.
- Los emojis hacen que el producto parezca mock.
- Los textos son frases universales de plantilla: "Ve el mundo con claridad", "Encuentra tu estilo", "Cuida tu salud visual".
- No hay contraste entre experiencia clinica, venta comercial local y promociones reales.
- No hay detalle optico: formas, materiales, medidas, tratamientos, marcas, receta, prueba, garantia.

### Direccion visual recomendada

No copiaria una landing SaaS ni una plantilla de e-commerce generica. OptiBlue necesita una direccion hibrida:

**Optica comercial local con presencia social fuerte + confianza clinica + promociones visibles.**

Lineamientos:

- Hero con fotografia real o producida: persona usando montura, asesora/o, personal clinico, fachada/equipo o producto real.
- Navy institucional para estructura, no como gradiente dominante.
- Azul claro pastel como campo visual principal en secciones promocionales, porque es el color mas repetido en piezas de Instagram.
- Blanco bold sobre imagen o fondos pastel para titulares promocionales, con mas control que en Instagram.
- Azul electrico como acento para promociones, porcentajes, CTA o badges, no como fondo total.
- Celeste del logo para detalles suaves, iconos o estados.
- Product cards V1 con foto principal, categoria, precio, descripcion, stock/destacado y CTA claro. Marcas, swatches/variantes y fit solo si se amplia el modelo o si se muestran como copy estatico verificado fuera del dato estructurado.
- Bloque Cashea visible si el negocio lo confirma como metodo activo.
- Bloque Promos visible si hay promociones vigentes reales.
- Servicios con lenguaje clinico sobrio, pero con foto/equipo/persona real.
- Sedes con foto, direccion real, mapa real, horario y CTA directo.

## Benchmark externo

### Warby Parker

Fuente: https://www.warbyparker.com/ y https://www.warbyparker.com/eyeglasses

Patrones relevantes:

- Navegacion por Eyeglasses, Sunglasses, Contacts, Eye exams, Insurance.
- CTA de style quiz y Virtual Try-On.
- Mensajes de confianza: shipping, returns, vision benefits.
- PLP con filtros ricos: bestsellers, shape, gender, frame width, color, material, frame price, prescription, features, nose bridge.
- Cards con producto real, variantes visuales y CTA de seleccion de lentes.

Reutilizable para OptiBlue:

- Quiz/asesor simple para elegir montura.
- Arquitectura de filtros como referencia futura. En V1 recortar a campos reales: categoria, precio, stock/destacado.
- Product card limpia con foto principal y datos V1. Variantes solo si se amplia el modelo.
- Bloque de confianza bajo hero.

No copiar:

- Modelo full ecommerce estadounidense con shipping/returns si OptiBlue opera por WhatsApp y sedes fisicas.

### LensCrafters

Fuente: https://www.lenscrafters.com/

Patrones relevantes:

- Entrada fuerte a `Book an eye exam`.
- Navegacion por categoria, marcas, lentes, eye exam, ofertas.
- Marcas visibles como parte de confianza.
- Flujo mental claro: find pair -> select lenses -> personalize lenses -> complete purchase.
- Incluye servicios de tienda: fittings, adjustments, buy online ship to store.

Reutilizable para OptiBlue:

- Separar "Comprar montura" de "Agendar examen".
- Mostrar marcas solo como copy/asset verificado o tras ampliar el modelo; Producto V1 no tiene campo `marca`.
- Explicar proceso de lentes en pasos.
- Dar peso a servicios presenciales.

### Zenni Optical

Fuente: https://www.zennioptical.com/

Patrones relevantes:

- Virtual Try-On destacado.
- Categorias comerciales: premium, under price, progressives, active, protective/safety, face shape.
- Mucha decision guiada por uso/estilo, no solo por categoria tecnica.

Reutilizable:

- Categorias de uso: trabajo/pantallas, lectura, sol, deporte, ninos, progresivos.
- Filtros por presupuesto si el cliente lo permite.

### EyeBuyDirect

Fuente: https://www.eyebuydirect.com/ y https://www.eyebuydirect.com/eyeglasses

Patrones relevantes:

- Virtual Try-On con copy de confianza: ver como queda antes de ordenar.
- Guias educativas: como ordenar, como elegir lentes, face shape, PD, lens index.

Reutilizable:

- Seccion educativa compacta para receta, PD, tratamientos y eleccion de montura.
- CTA de ayuda si el cliente no sabe que elegir.

### Specsavers

Fuente: https://www.specsavers.com/

Patron relevante:

- Es mas optica/servicio presencial que tienda fashion. Importa como referencia de confianza local: examenes, lentes de contacto, ubicaciones y cita.

Reutilizable:

- Dar prioridad a sedes y examen visual para usuarios que no llegan listos a comprar.

## GitHub / templates revisados

### renchester/eyewear-shop

Fuente: https://github.com/renchester/eyewear-shop

Tiene ideas utiles: busqueda, ordenamiento, paginacion, progressive image loading. Pero el README declara que es mock/practica y que no posee derechos de assets. No recomendaria reutilizar assets ni UI completa. Se puede usar como referencia funcional, no como base visual.

### templatesJungle/eyewear-free-ecommerce-website-template

Fuente: https://github.com/templatesJungle/eyewear-free-ecommerce-website-template

Es una plantilla especifica de eyewear, pero antes de reutilizar cualquier cosa hay que revisar licencia real, assets y terminos. Como punto de inspiracion sirve; como base directa para cliente high-ticket, riesgo de verse plantilla.

### SujalXplores/vision-eyewear-react-ecommerce

Fuente: https://github.com/SujalXplores/vision-eyewear-react-ecommerce

Repositorio archivado desde 2022, pocas estrellas, stack antiguo. No recomendable como base.

### SandhyaR1007/eyesome-react

Fuente: https://github.com/SandhyaR1007/eyesome-react

MIT, con features ecommerce completas: PLP, filtros, search, wishlist, cart, checkout, auth, loaders/toasts. Puede servir para revisar patrones funcionales, pero visualmente no garantiza la direccion premium/local que OptiBlue necesita.

## Recomendacion sobre reutilizar UI

No recomiendo clonar una pagina/template de GitHub como solucion principal. Eso cambiaria una UI generica por otra UI generica, y ademas ignoraria que OptiBlue ya tiene codigos visuales propios en Instagram.

Si Marlon autoriza una intervencion, recomendaria:

1. Usar Warby Parker, LensCrafters, Zenni y EyeBuyDirect como benchmark de UX.
2. Construir una direccion visual propia para OptiBlue a partir de su Instagram: navy, azul pastel, blanco bold, celeste, fotos reales, Cashea/promos y rostro humano.
3. Reutilizar solo patrones, no identidad:
   - filtros ricos como referencia futura, recortados en V1 a campos reales
   - product cards con variantes solo si se amplia el modelo
   - selector/quiz de estilo
   - proceso de lentes por pasos
   - estados de carga/error
   - secciones de confianza
4. Solo reutilizar codigo open source despues de verificar licencia y calidad.

## Plan de trabajo recomendado si se autoriza

### Fase 0 - Contrato backend V1 y datos permitidos

Antes de pedir assets o campos, la UI debe respetar el backend real. Lectura completa del backend el 2026-07-11: `pnpm test` pasa 25/25 contra emuladores. El backend V1 soporta estos datos estructurados:

Producto:

- nombre
- categoriaId
- precio
- imagenUrl
- descripcion
- stock
- destacado

Categoria:

- key
- label
- orden

Sede:

- ciudad
- direccion
- telefono
- whatsapp
- horario
- maps

Pedidos/citas/cotizaciones ya existen para tracking de conversion, pero no agregan campos de merchandising al catalogo.

Fuera de V1 salvo nueva decision tecnica:

- marca
- color
- material
- medidas
- forma
- variantes/swatches
- fotos multiples por producto
- disponibilidad por sede
- politicas de garantia/devolucion/retiro como dato estructurado
- claims como rating Google, anos o cantidad de modelos como dato estructurado
- Cashea/promos como entidades backend
- calendario real de disponibilidad
- carrito multi-producto
- pasarela de pago

Regla: no pedir ni disenar features que dependan de esos campos como si ya existieran. Pueden aparecer solo como copy/asset estatico verificado dentro de V1, o se crea un issue separado de ampliacion de modelo.

### Fase 1 - Correcciones UX criticas

- Cambiar copy de ciudades a sedes reales o eliminar ciudades hasta tener datos.
- Ocultar `Panel` de la nav publica.
- Crear menu mobile.
- Agregar loading/error/empty states para productos, categorias y sedes.
- Quitar claims no verificados.
- Actualizar README.
- Agregar fallback de catalogo si Firestore falla.

### Fase 2 - Redisenar storefront publico

- Nuevo hero con asset real y propuesta concreta, alineado con la marca social/comercial del Instagram.
- Bloque de confianza: examen, sedes y WhatsApp con datos reales. Garantia/marcas solo si se verifican como copy estatico o se amplia el modelo.
- Bloque visible de Cashea/promos solo como contenido estatico verificado; no existe modelo backend para eso en V1.
- Catalogo con imagen principal, categorias, precio, descripcion, stock/destacado y cards opticas dentro del modelo V1.
- Pagina/Modal detalle de producto antes de reservar.
- Seccion "No sabes que elegir?" con quiz/asesoria.
- Sedes con mapa real. Foto de sede solo como asset estatico fuera del modelo, porque `Sede` V1 no tiene campo de imagen.
- Servicios con flujo de cita honesto.

### Fase 3 - Mejorar conversion

- Revisar si Google login debe ser obligatorio.
- Permitir continuar por WhatsApp con formulario simple si login falla o el usuario no quiere login.
- Cambiar "Reservar" por CTA mas claro segun negocio: "Consultar disponibilidad", "Apartar en sede", "Cotizar con mi formula".
- Agregar confirmacion post-envio, no solo abrir WhatsApp.

### Fase 4 - Visual system

- Reemplazar emojis por iconos consistentes o fotografias.
- Paleta derivada del Instagram: navy, azul pastel, blanco, azul electrico y celeste del logo.
- Tipografia con personalidad.
- Componentes responsive reales.
- Tokens para spacing, typography, shadows, breakpoints.
- Estados hover/focus accesibles.

### Fase 5 - Performance/SEO

- Code splitting por rutas, especialmente admin.
- Metadata por ruta.
- Structured data: LocalBusiness/Optician, Product cuando exista catalogo real.
- Lazy loading de imagenes.
- Optimizar Firebase/admin fuera del bundle publico cuando sea posible.

## Criterio de aceptacion para decir que dejo de verse "hecha por IA"

- El primer viewport muestra una optica real: producto/persona/sede/equipo, no un gradiente generico.
- La paleta se reconoce como OptiBlue por su Instagram: navy + azul pastel + blanco bold + acentos azul electrico/celeste.
- No hay emojis como sustituto de iconografia o producto.
- El usuario movil puede navegar todo sin overflow horizontal.
- Catalogo tiene fotos reales y filtros utiles para elegir lentes.
- Las sedes son reales o se declaran honestamente como pendientes.
- Los claims visibles tienen respaldo.
- El flujo principal no bloquea conversion innecesariamente.
- El admin no aparece en la experiencia publica.
- El sitio explica por que confiar con lo verificable V1: especialistas/servicios si hay contenido real, sedes, proceso y WhatsApp. Garantia/marcas solo como copy verificado o fuera de V1.

## Pendientes accionables para Linear si Marlon autoriza

No cree ni modifique issues por instruccion del usuario. Si se autoriza, estos serian buenos issues:

- Bug: corregir nav mobile publica.
- Bug: eliminar/ocultar link admin del storefront.
- Bug: corregir ciudades/claims no verificados en hero.
- Feature: estados loading/error/empty para Firestore publico.
- Feature: redisenar catalogo con campos reales V1, imagen principal, filtros por categoria/precio/stock y detalle de producto sin inventar marca/color/material/medidas.
- Feature: redisenar home con direccion visual comercial local/social + clinica.
- Spike: decidir si login Google debe ser obligatorio para clientes.
- Chore: actualizar README al estado real.
