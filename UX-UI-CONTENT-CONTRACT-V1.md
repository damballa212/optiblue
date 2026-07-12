# OptiBlue - Contrato de contenido V1 para storefront publico

Fecha: 2026-07-11

Alcance: Fase 1 de `UX-UI-IMPLEMENTATION-PLAN.md`. Este documento define que contenido puede usar el rediseño V1 sin inventar datos ni ampliar el backend implicitamente.

## Fuentes verificadas

- Frontend: `/Users/marlon/Documents/trae_projects/optiblue/optiblue-web`.
- Backend: `/Users/marlon/Documents/trae_projects/optiblue/optiblue-backend`.
- Tipos backend leidos: `src/types/producto.ts`, `src/types/categoria.ts`, `src/types/sede.ts`.
- Seed backend leido: `scripts/seed.ts`.
- Linear leido: MAR-103, MAR-104, MAR-108.
- Capturas de Instagram aportadas por Marlon y revisadas manualmente: `optiblue_`.
- Export de Claude Design revisado: `/Users/marlon/Downloads/OptiBlue Redesign Venezuela 2`.

## Estado real de datos/assets

### Catalogo

No se encontro Excel, CSV ni archivo de catalogo real en:

- `/Users/marlon/Documents/trae_projects/optiblue`
- `/Users/marlon/Downloads` con nombres relacionados a OptiBlue/catalogo

Estado Linear: MAR-103 esta en Backlog. Por tanto, el catalogo real sigue bloqueado por el Excel del cliente.

El seed backend tiene productos de prueba, no catalogo real:

- `Montura Classic Pro`
- `Montura Slim Line`
- `Solar Aviator UV400`
- `Sport Running Elite`

Todos los productos del seed tienen `imagenUrl: null`. No hay imagen real de producto verificada para V1.

### Assets

No se encontraron imagenes propias del storefront dentro del repo `optiblue-web`.

El export de Claude Design no contiene un rediseño usable:

- `OptiBlue Storefront.dc.html` renderiza en blanco.
- `.thumbnail` esta en blanco.
- `support.js` es runtime, no contiene el diseno.
- `uploads/` contiene capturas de Instagram/referencias, no pantallas del rediseño ni assets finales de producto.

Uso permitido de esas capturas: referencia de direccion visual. Uso no permitido: tratarlas como assets finales de hero, producto, sede, claim o promocion.

### Sedes

Estado Linear: MAR-104 esta In Progress y bloqueado por Carlos/cliente.

El seed backend confirma las ciudades reales actuales:

- Barinas
- Acarigua
- Barquisimeto

Pero direccion, telefono, WhatsApp y Maps siguen como placeholders:

- `Por definir con el cliente`
- `Por definir`
- `https://maps.google.com`

Valencia queda fuera de V1 actual como sede activa. Solo puede mencionarse como futura si el cliente lo confirma y se decide como copy estatico.

## Contrato V1 por entidad

### Producto

Campos soportados:

- `nombre`
- `categoriaId`
- `precio`
- `imagenUrl`
- `descripcion`
- `stock`
- `destacado`

Reglas:

- Cada producto puede tener una sola imagen principal via `imagenUrl`.
- No hay soporte V1 para galeria/fotos multiples.
- `imagenUrl` puede ser `null`; la UI debe mostrar un fallback profesional, no emoji como producto.
- No usar marca, color, material, medidas, forma o variantes en cards/filtros/detalle porque esos campos no existen.
- No afirmar disponibilidad por sede: solo existe `stock` global.

### Categoria

Campos soportados:

- `key`
- `label`
- `orden`

Reglas:

- Las categorias son administrables; no deben asumirse fijas.
- El seed actual trae `monturas`, `solares`, `deporte`, pero el Excel real puede cambiar esto.
- Los filtros V1 pueden usar categorias y, si aporta valor, precio/stock/destacado desde producto.
- No crear filtros por marca/color/material/forma/medidas en V1.

### Sede

Campos soportados:

- `ciudad`
- `direccion`
- `telefono`
- `whatsapp`
- `horario`
- `maps`

Reglas:

- Mostrar solo sedes existentes en Firestore.
- Si una sede trae `Por definir`, la UI no debe presentarlo como dato confiable final.
- Botones de WhatsApp/Maps solo deben prometer contacto/ubicacion real cuando `whatsapp` y `maps` esten completos.
- No hay disponibilidad por sede ni inventario por sede en V1.

## Contenido estatico permitido si se confirma

Estos temas no existen como entidades backend. Si se usan en V1, deben ser bloques/copy estaticos verificados, no campos de catalogo ni filtros.

### Cashea

Evidencia actual: aparece visible en Instagram como highlight y pieza de contenido.

Estado V1: no confirmado como oferta activa ni con terminos vigentes.

Regla: no mostrar un bloque activo de Cashea hasta tener confirmacion del cliente/Carlos. Si se confirma, pedir texto exacto, condiciones y vigencia. No crear entidad backend para Cashea en V1.

### Promociones

Evidencia actual: Instagram muestra piezas con `PROMO`, `60%`, `TOP 3` y monturas disponibles.

Estado V1: no hay promocion vigente verificada para web.

Regla: no mostrar porcentajes, descuentos, precios "antes/despues" ni claims promocionales hasta tener vigencia y condiciones. No crear entidad backend para promociones en V1.

### Claims comerciales

No hay evidencia estructurada para:

- anos de experiencia
- rating Google
- cantidad de modelos
- garantia
- politica de devolucion
- tiempos de entrega/retiro

Regla: no mostrar claims de confianza como numeros o politicas hasta tener evidencia. Si se reciben, V1 puede mostrarlos como copy estatico o FAQ simple, no como modelo backend nuevo.

### Marcas visibles

Evidencia actual: Instagram muestra o menciona Ray-Ban, Ray-Ban Meta y Gucci.

Estado V1: no hay campo `marca` en producto ni catalogo real verificado.

Regla: no usar marcas como filtros, badges de producto ni claims de catalogo. Solo se pueden usar en copy/asset estatico si el cliente confirma que son marcas disponibles y autoriza mostrarlas.

## Checklist de insumos que debe pedir Carlos/cliente

### Para MAR-103 - catalogo real

Por producto:

- nombre
- categoria
- precio
- descripcion corta
- stock global
- destacado si aplica
- URL de imagen principal o archivo para subir y convertir a `imagenUrl`

No pedir para V1 salvo ampliacion de modelo:

- marca
- color
- material
- medidas
- forma
- variantes
- galeria
- disponibilidad por sede

### Para MAR-104 - sedes reales

Por sede:

- ciudad
- direccion exacta
- telefono
- WhatsApp operativo
- horario
- link real de Google Maps

### Para bloques estaticos opcionales

Cashea:

- confirmar si esta activo
- condiciones
- texto aprobado
- vigencia o aclaracion de vigencia

Promociones:

- porcentaje/descuento exacto
- productos/categorias incluidas
- fecha de inicio/fin
- condiciones
- texto aprobado

Claims/politicas:

- evidencia o fuente
- texto exacto aprobado
- alcance y excepciones

## Decision para rediseño V1

El rediseño puede avanzar sin inventar informacion si respeta estas reglas:

- Usar una direccion visual basada en Instagram, pero no usar las capturas como contenido final de producto/sede.
- Construir componentes preparados para contenido real, con fallbacks honestos.
- Mostrar producto solo con campos V1.
- Mostrar sedes solo con campos V1.
- Mantener Cashea/promos/marcas/claims como bloqueos hasta confirmacion.
- Si se quiere UI con marca/color/material/medidas/variantes/disponibilidad por sede, primero crear issue separado de ampliacion de modelo.

