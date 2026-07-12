# OptiBlue V1 - Plan de integridad de cotizaciones, precios y sedes

Fecha: 2026-07-12

Repositorios:

- Frontend: `/Users/marlon/Documents/trae_projects/optiblue/optiblue-web`
- Backend: `/Users/marlon/Documents/trae_projects/optiblue/optiblue-backend`

Estado: plan aprobado en alcance; implementacion no iniciada.

## Alcance confirmado

- Corregir el calculo de cotizacion para que el backend sea autoritativo.
- Hacer administrables el precio base y los extras de lentes.
- Agregar validacion y diagnostico de completitud para sedes.
- Mantener los servicios como contenido estatico durante V1.
- No trabajar en la importacion del Excel mientras el cliente no lo entregue.
- No inventar precios, productos, contactos, mapas, promociones ni assets.

El punto `5.` del mensaje original no tenia contenido; no se agrega una quinta iniciativa por inferencia.

## Evidencia actual verificada

- `PageLentes.tsx` calcula el total con el precio Firestore de la montura, `LENTE_BASE = 10` y `EXTRAS_LENTES` locales.
- El frontend envia `total` en `POST /cotizaciones`.
- `cotizacionInputSchema` acepta ese `total` y `cotizacionesService` lo persiste sin recalcular.
- El backend ya puede leer el producto por ID mediante `catalogoService.getProducto()`.
- El admin de sedes permite guardar valores `Por definir` y el Maps generico `https://maps.google.com`.
- La UI publica ya deshabilita WhatsApp/Maps no configurados, pero el admin no explica completitud ni evita duplicados de ciudad.
- Los servicios publicos se leen de `src/data/servicios.ts`; su accion crea una cita real mediante `apiCitas`.
- Firestore Rules todavia permite lectura publica de `/servicios`, aunque V1 no usa esa coleccion.

## Decisiones de arquitectura

### Backend autoritativo

El cliente nunca decide el total almacenado. El backend debe:

1. Recibir `productoId`, formula, extras y datos del cliente.
2. Leer el producto real desde Firestore.
3. Leer la configuracion vigente de cotizacion.
4. Validar que cada extra exista, este activo y no este duplicado.
5. Calcular en centavos: montura + lente base + extras.
6. Guardar y devolver el `total` calculado.

El campo `total` se elimina del input publico, pero se conserva en la entidad `Cotizacion` y en registros historicos.

### Configuracion de precios

Documento privado y determinista en Firestore:

`configuracion/cotizacion`

Contrato propuesto:

```ts
interface ConfiguracionCotizacion {
  lenteBase: number;
  extras: Array<{
    key: string;
    label: string;
    descripcion: string;
    precio: number;
    activo: boolean;
    orden: number;
  }>;
}
```

No se agregan marcas, monedas, promociones, vigencias ni historiales porque no existen requisitos verificados para ellos.

La configuracion permanece bloqueada por Firestore Rules. Se accede por `apiCotizaciones`:

- `GET /configuracion`: publico, solo lectura.
- `PUT /configuracion`: admin, exige ID token y claim `admin:true`.

No se crea una Function nueva ni un modulo transversal innecesario; repositorio, servicio y schemas viven dentro de `cotizaciones`.

### Compatibilidad y rollout

- Zod elimina campos desconocidos por defecto: el frontend anterior puede seguir enviando `total`, pero el backend nuevo lo ignora y recalcula.
- Si no existe `configuracion/cotizacion`, cotizar debe fallar con error explicito; no usar precios silenciosos de fallback.
- Antes de desplegar el backend nuevo se crea el documento de configuracion con exactamente los valores actuales para preservar comportamiento: base `$10` y extras actuales.
- Esos valores se etiquetan como migracion del comportamiento vigente, no como precios confirmados por el cliente.
- Las cotizaciones historicas no se reescriben.

### Servicios V1

- `SERVICIOS` permanece local y tipado.
- No se agrega CRUD de servicios al admin.
- Las solicitudes siguen registrandose como citas reales.
- Se elimina la lectura publica inutil de `/servicios` en Firestore Rules si `rg` confirma que ningun consumidor la usa.

## Fase 0 - Contratos y pruebas rojas

Backend:

- [ ] Agregar tests que demuestren que hoy se puede manipular `total`.
- [ ] Agregar tests para producto inexistente.
- [ ] Agregar tests para extra desconocido, inactivo y duplicado.
- [ ] Agregar tests para configuracion ausente e invalida.
- [ ] Agregar tests de autorizacion para actualizar configuracion.
- [ ] Agregar tests de precision decimal calculando en centavos.

Frontend:

- [ ] Agregar tests del cliente de configuracion.
- [ ] Agregar tests del calculo de vista previa con configuracion recibida.
- [ ] Agregar tests de validacion/completitud de sede.
- [ ] Mantener las pruebas actuales de filtros, WhatsApp, mapas e imagenes.

Gate:

- [ ] Confirmar rojo por la razon esperada antes de implementar.

## Fase 1 - Configuracion de cotizacion en backend

- [ ] Crear `configuracionCotizacionSchema` con numeros no negativos, keys unicas y orden valido.
- [ ] Crear schema de input administrativo sin campos derivados.
- [ ] Crear `configuracion-cotizacion.repository.ts` dentro del modulo `cotizaciones`.
- [ ] Implementar lectura del documento `configuracion/cotizacion`.
- [ ] Implementar actualizacion completa del documento para admin.
- [ ] Agregar `GET /configuracion` publico.
- [ ] Agregar `PUT /configuracion` protegido por `requireAdmin`.
- [ ] No exponer escritura directa en Firestore Rules.
- [ ] Exportar solo lo necesario desde `modules/cotizaciones/index.ts`.
- [ ] Ejecutar tests de handler, service y repositorio contra emuladores.

## Fase 2 - Total autoritativo en backend

- [ ] Cambiar `cotizacionInputSchema` para omitir `total`.
- [ ] Hacer `createCotizacion` asincrono y autoritativo.
- [ ] Obtener producto mediante `catalogoService.getProducto(productoId)`.
- [ ] Obtener configuracion vigente.
- [ ] Rechazar extras desconocidos/inactivos/duplicados con 400.
- [ ] Calcular importes en centavos y convertir una sola vez a numero monetario.
- [ ] Persistir `total` calculado con estado `pendiente`.
- [ ] Devolver la cotizacion persistida con total autoritativo.
- [ ] Verificar que un `total` manipulado enviado por un cliente anterior se ignore.
- [ ] Verificar que no cambian los estados ni el back office historico.

## Fase 3 - Bootstrap seguro de precios

- [ ] Crear script idempotente `scripts/bootstrap-cotizacion-config.ts`.
- [ ] Agregar modo dry-run que no escriba.
- [ ] Agregar comando documentado en `package.json`.
- [ ] Inicializar emulador con los valores actuales, no con valores nuevos.
- [ ] Verificar segunda ejecucion sin duplicacion ni documentos adicionales.
- [ ] Confirmar contenido exacto antes de ejecutar contra produccion.
- [ ] Crear `configuracion/cotizacion` en produccion antes del backend nuevo.
- [ ] No imprimir credenciales ni datos sensibles.

## Fase 4 - Frontend consume configuracion real

- [ ] Agregar tipos `ConfiguracionCotizacion` y `ExtraCotizacion` alineados con Zod backend.
- [ ] Agregar API `obtenerConfiguracionCotizacion()` publica.
- [ ] Agregar API admin `actualizarConfiguracionCotizacion()` autenticada.
- [ ] Crear hook con estados `loading/error/success`.
- [ ] Eliminar `LENTE_BASE` y `EXTRAS_LENTES` del calculo operativo de `PageLentes`.
- [ ] Renderizar base y extras desde la configuracion recibida.
- [ ] Mantener montura/precio desde Firestore.
- [ ] No permitir avanzar a resumen si no cargo configuracion valida.
- [ ] Enviar la cotizacion sin `total`.
- [ ] Usar el `total` devuelto por backend en confirmacion y WhatsApp.
- [ ] Si la configuracion cambia entre vista previa y POST, prevalece y se muestra el total devuelto.
- [ ] Mantener nombre/telefono y Google opcional sin cambios.

## Fase 5 - Admin de precios de lentes

- [ ] Agregar seccion `Precios de lentes` al panel admin.
- [ ] Mostrar precio base y lista ordenada de extras.
- [ ] Permitir editar label, descripcion, precio, activo y orden.
- [ ] Validar keys unicas y estables; no permitir cambiarlas accidentalmente durante una edicion normal.
- [ ] Usar inputs numericos con minimo cero y paso monetario.
- [ ] Mostrar loading/error/success sin optimismo falso.
- [ ] Guardar mediante `PUT /configuracion` con Auth admin.
- [ ] Volver a leer la configuracion guardada antes de confirmar exito.
- [ ] Verificar que el storefront refleja el cambio sin redeploy.

## Fase 6 - Integridad y completitud de sedes

No se endurece el schema para obligar datos que el cliente aun no entrego. Se permiten borradores, pero nunca se presentan como completos.

- [ ] Extraer validadores puros compartibles en frontend admin/publico.
- [ ] Detectar placeholders vacios, `Por definir` y `Por confirmar`.
- [ ] Validar WhatsApp por normalizacion, sin asumir un operador o prefijo venezolano especifico.
- [ ] Validar telefono por longitud razonable de digitos, sin imponer formato local no confirmado.
- [ ] Validar Maps como URL HTTP(S) especifica; rechazar homepages genericas como ubicacion completa.
- [ ] Mostrar badge `Completa` o `Incompleta` por sede.
- [ ] Listar exactamente los campos faltantes/invalidos.
- [ ] Deshabilitar `Probar WhatsApp` y `Ver mapa` en admin cuando no sean utilizables.
- [ ] Agregar validacion inline al formulario antes de guardar valores malformados.
- [ ] Permitir guardar placeholders explicitos como borrador hasta recibir MAR-104.
- [ ] Impedir ciudades duplicadas por comparacion normalizada en backend.
- [ ] No limitar ciudades a tres: Valencia futura sigue fuera, pero el modelo no debe bloquearla.
- [ ] Reutilizar el mismo criterio de Maps/WhatsApp en admin y storefront para evitar contradicciones.
- [ ] Mantener los CTAs publicos deshabilitados mientras falten datos reales.

## Fase 7 - Servicios estaticos y superficie minima

- [ ] Confirmar con `rg` que ningun runtime lee la coleccion `servicios`.
- [ ] Mantener `src/data/servicios.ts` como fuente V1.
- [ ] Mantener `PageServicios` registrando citas por backend.
- [ ] Eliminar `match /servicios/{servicioId}` de Firestore Rules si sigue sin consumidores.
- [ ] Eliminar tipos backend de servicio solo si TypeScript/`rg` confirman que estan muertos.
- [ ] Documentar explicitamente que hacer servicios administrables requiere una decision post-V1.

## Fase 8 - Verificacion integral

Backend:

- [ ] `pnpm test` contra Firestore/Auth emulators.
- [ ] `pnpm run build`.
- [ ] Prueba de manipulacion: enviar total falso y confirmar total calculado.
- [ ] Prueba de extra invalido/inactivo/duplicado.
- [ ] Prueba de producto/configuracion inexistente.
- [ ] Prueba de GET publico y PUT admin de configuracion.
- [ ] Prueba de escritura Firestore directa rechazada.

Frontend:

- [ ] `npm test`.
- [ ] `npm run build`.
- [ ] `git diff --check`.
- [ ] Cotizacion completa mobile/desktop contra emuladores.
- [ ] Cambio de precios desde admin reflejado sin redeploy.
- [ ] Sede incompleta y completa en admin/publico.
- [ ] Teclado, foco, errores y confirmacion preservan datos.
- [ ] Servicios siguen solicitando cita sin depender de Firestore.

Seguridad y regresion:

- [ ] `pnpm audit` backend y `npm audit` frontend.
- [ ] Revisar que ningun endpoint de escritura de configuracion sea publico.
- [ ] Revisar que cliente no pueda controlar total, estado ni precio de producto.
- [ ] Revisar diff completo de ambos repositorios.

## Fase 9 - Rollout sin interrupcion

Orden obligatorio:

1. [ ] Ejecutar tests completos en emuladores.
2. [ ] Ejecutar bootstrap dry-run de configuracion.
3. [ ] Crear configuracion real en produccion con los valores vigentes actuales.
4. [ ] Desplegar Functions y Rules backend.
5. [ ] Verificar `GET /configuracion` en produccion.
6. [ ] Desplegar frontend Hosting.
7. [ ] Verificar Home, Lentes, Servicios, Sedes y Admin.
8. [ ] Crear una cotizacion controlada solo si puede eliminarse y no contamina datos reales; de lo contrario, limitar produccion a smoke no destructivo.
9. [ ] Confirmar logs sin errores y bundle correcto.
10. [ ] Commit/push por repo con SHA referenciado en Linear.
11. [ ] Actualizar Obsidian y daily con decisiones/resultados.

Rollback:

- [ ] Hosting puede volver a la version Firebase anterior.
- [ ] Functions puede volver al commit anterior sin borrar configuracion.
- [ ] El documento de configuracion nuevo es aditivo y no modifica cotizaciones historicas.
- [ ] No borrar ni reescribir datos de productos, sedes o cotizaciones durante rollback.

## Fuera de alcance

- Excel/importacion de catalogo real.
- Fotos o assets del cliente.
- Completar datos reales de MAR-104.
- Cashea, promociones o claims.
- CRUD de servicios.
- Variantes, stock por sede, carrito o pagos.
- Historial/versionado de configuracion de precios.
- Recalcular cotizaciones historicas.
- Rediseño visual del admin fuera de las superficies nuevas de precios/completitud.

## Criterio de cierre

- El total guardado no puede ser controlado por el navegador.
- Los precios pueden cambiarse por admin sin redeploy.
- El storefront y backend usan una misma configuracion vigente.
- Una sede incompleta se identifica igual en admin y publico.
- Servicios siguen estaticos y sus solicitudes siguen registrandose.
- Produccion se despliega sin inventar ni alterar datos del cliente.
