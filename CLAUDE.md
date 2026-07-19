# first-backend — guía para Claude

API REST (Node + Express 5 + TypeScript + MongoDB/Mongoose). Es el backend de **First**:
futura plataforma multipropósito **CRM + CMS** (gestión de webs, ecommerce, flujos de venta).
Se construye paso a paso; prioriza arquitectura entendible/escalable, middlewares claros y
**máxima reutilización** (no crear utilitarios dos veces).

> 📌 **Antes de re-escanear, lee primero estos docs** (mantienen el estado vivo):
> - `docs/ESTADO-Y-MEJORAS.md` — estado, decisiones, roadmap por fases, deuda y pendientes.
> - `docs/API-UPLOADS.md` — contrato multipart de subida de imágenes + checklist del front.
> - Memoria de sesión: `backend-analysis-2026-06` (en la auto-memoria).

## Comandos
- `pnpm test` — vitest (suite completa, ~903 tests). Usa mongodb-memory-server para los
  tests `withMongo()`.
- `pnpm typecheck` — `tsc --noEmit`. `pnpm lint` — eslint (debe quedar en 0).
- `pnpm dev` — nodemon. `pnpm build` — tsc + tsc-alias.
- Seed super-admin: `node --env-file=.env scripts/seed-super-admin.js`
  (requiere env `MONGO_URI`, `SUPER_ADMIN_PASSWORD`, `SEED_DATABASES`; **sin secretos
  hardcodeados**).

## Arquitectura (DDD modular)
`src/modules/<m>/` con capas: `application/` (casos de uso, lógica pura) · `controllers/`
(HTTP delgados) · `domain/errors/` · `infrastructure/` (modelo Mongoose) · `routes/` ·
`schemas/` (Zod) · `constants/` · `locales/` (10 idiomas) · `index.ts` (API pública).
Módulos: auth, users, user-groups, clients, services, portfolio, pages, collaborators,
subscribers, forms, storage, audit-log, app-settings, notifications-email, health.
Aliases: `@Modules`, `@Helpers`, `@Shared`, `@Constants`, `@Middlewares`, `@Config`, `@Types`,
`@test`. Respuestas vía `successResponse`/`errorResponse` (`helpers/responseStructure`).
i18n: errores globales en `src/locales/<lang>/errors.json`; mensajes por módulo en
`modules/<m>/locales/<lang>/messages.json` (siempre los **10**: en,es,de,fr,it,ja,ko,pt,ru,zh).

## Convenciones CRÍTICAS (respetar para no romper/regресar)
- **Soft-delete = `deletedAt: Date|null`.** El enum `status` es solo `active|inactive`
  (en portfolio: `draft|published|archived`). **NO existe `status: 'deleted'`** — no lo
  siembres ni lo afirmes en tests (ese bug ya se saneó una vez).
- **Hard-delete/purge** exige que el registro esté en papelera (`deletedAt != null`).
- **Bulk** ops devuelven `{ processed, processedIds, notFoundIds }`; el código de respuesta
  se arma con `helpers/bulkOutcome` → `` `PREFIX_${bulkOutcome(data)}` `` (NONE/PARTIAL/SUCCESS).
- **Mongo E11000** lo mapea `errorMiddleware` a `409 RESOURCE_DUPLICATE` (la verdad de
  unicidad es el índice; los pre-checks son solo UX).
- **Validación**: `validate(schema, data)` / `validateArray` de `@Helpers/validate` (lanza el
  422 estándar `VALIDATION_SCHEMA_ERROR`). **TODOS los controllers ya lo usan** — no quedan
  `safeParse` inline. Coacciones (p. ej. ISO→Date) van **en el schema** (`z.preprocess`), no
  en middlewares. No crees middlewares de validación ni vuelvas al `safeParse` manual.

## Documentación OpenAPI/Swagger (`/api/v1/docs`)
Generada desde los **schemas Zod reales** vía `@asteasolutions/zod-to-openapi` (no YAML/JSDoc
a mano) — request bodies 100% fieles, response bodies verificados una vez contra el modelo
Mongoose real de cada módulo (no por-endpoint). Cada módulo con rutas HTTP tiene su propio
`<módulo>/<módulo>.openapi.ts` (mismo patrón que `routes/route.ts`); `src/config/openapi/document.ts`
importa cada uno solo por su efecto secundario (`registry.registerPath`/`registry.register`).
Helpers reusables en `src/config/openapi/responses.ts` (`successResponse`, `commonErrorResponses`,
`bulkResultSchema`, `multipartWithFile`, etc.) — revisar antes de escribir un `.openapi.ts` nuevo.
- **Gotcha de orden de imports (ya resuelto, no reintroducir):** `extendZodWithOpenApi(z)`
  (en `registry.ts`) parchea las factories de Zod (`z.object`, etc.) — solo los schemas
  **construidos después** de ese parche obtienen `.openapi()`. Por eso `mainServer.ts`
  importa `./openapi/mount` **antes** que `@Routes/routes` (que construye todos los schemas
  de negocio vía `.schema.ts`). Typecheck no detecta una regresión de esto (falla solo en
  runtime, dentro de `buildOpenApiDocument()`) — si se reordenan esos imports, probarlo
  arrancando el server y pegándole a `/api/v1/docs.json`, no solo con `tsc`.
- Público por defecto; se gatea con Basic Auth seteando `API_DOCS_USER`+`API_DOCS_PASSWORD`
  (ambos, en Vercel) — sin cambio de código, requiere redeploy.
- `*.openapi.ts` está excluido de coverage (`vitest.config.ts`) — es config declarativa sin
  lógica que testear, nunca se ejecuta fuera de `/docs`.
- **Gotcha de Vercel (ya resuelto, no reintroducir):** `swagger-ui-express` sirve sus
  estáticos (`swagger-ui-bundle.js`, `.css`, iconos) vía `express.static()` leyendo
  `node_modules/swagger-ui-dist` en disco — Vercel's Node File Trace **no** los detecta
  (solo sigue `require()`, no lecturas de filesystem en runtime), así que sin ayuda esos
  archivos NO se empaquetan en la función serverless: el endpoint responde 200 pero con
  el HTML de fallback en vez del JS real (`SwaggerUIBundle is not defined` en consola).
  Arreglado con `functions["api/index.js"].includeFiles` en `vercel.json` apuntando al
  symlink `node_modules/swagger-ui-dist/**` (⚠️ el patrón vía `.pnpm/swagger-ui-dist@**/...`
  NO funciona, ni siquiera en un deploy real — probado). Verificar con
  `vercel deploy` (preview) + `curl` al asset (debe pesar ~1.5MB, no ~3KB) antes de
  confiar en que un cambio a este mecanismo sigue funcionando — `pnpm typecheck`/`lint`/
  `test` no lo detectan, y ni siquiera `vercel build` local confirma `includeFiles`
  de forma fiable (hay que probar contra un deploy real).

## Patrón de subida de imágenes (backend-driven) — establecido en este repo
El front manda **un solo request**; el backend sube. Detalle en `docs/API-UPLOADS.md`.
- Endpoints create/update aceptan `multipart/form-data`: part `data` (JSON del body) +
  part de archivo. También aceptan JSON puro sin archivo.
- Controller: `parseRequestData(req)` + `getUploadedFile(req)` (o `getUploadedFileField`
  para multi-campo) de `@Helpers/multipartRequest`.
- Use-case: dedup → pre-generar `id` → `uploadImageSafe(...)` (nunca lanza; devuelve
  `{url?, storageId?, warning?}`) → insert → compensar con `deleteEntityFiles` si el insert
  falla. Devuelve `MutationResult<T> = { data, warnings }`.
- **Update** = reemplazo: subir nueva → `deleteEntityFiles(type, id, {exceptStorageIds:[new]})`;
  si el save falla, `deleteStorageFilesByIds([new])`.
- **Purge** llama `deleteEntityFiles(type, id)`.
- Rutas: `...acceptImage('campo')` (o `acceptImageFields(['logo','favicon'])` en app-settings).
- Warnings: si la subida falla, el registro se guarda igual + `warnings:[{field,code,message}]`
  (no bloqueante). `successResponse` traduce `warnings` contra ns `errors`.

| Módulo | Campo multipart | Campo entidad | entityType |
|---|---|---|---|
| clients | `logo` | `logoUrl` | `clients` |
| users | `avatar` | `profilePictureUrl` | `users` |
| collaborators | `photo` | `photoUrl` | `collaborators` |
| portfolio | `cover` | `coverImageUrl` (**requerido**, valida el use-case) | `portfolio` |
| services | `cover` | `coverImageUrl` | `services` |
| app-settings | `logo`,`favicon` | `appearance.logoUrl/faviconUrl` | `app-settings` (entityId=`logo`/`favicon`) |

Storage es **agnóstico** (vercel-blob/s3/gcs/azure vía `STORAGE_DRIVER`). Imágenes ≤4 MB
(`STORAGE_MAX_IMAGE_SIZE_BYTES`), validadas por magic-bytes; genera variantes full/thumb webp.

## users vs collaborators
NO son lo mismo: `users` = identidad con acceso (login, grupo, permisos); `collaborators` =
entidad CMS pública (equipo). Separación intencional.

## `forms` — schemas de validación dinámicos (patrón nuevo, reutilizable)
A diferencia de todo otro módulo (schema Zod estático escrito a mano), los campos de un
formulario son **datos** definidos por el admin — así que el schema de una respuesta se
construye en tiempo de request desde `form.fields` vía `buildSubmissionSchema(fields)`
(`modules/forms/schemas/buildSubmissionSchema.ts`): un `switch` por `field.type` (8 tipos:
text/textarea/email/phone/select/radio/checkbox/date) que arma un `z.object(shape)`.
**Convención a mantener si se repite este patrón en otro módulo:**
- Clave cada campo por su `fieldId` (uuid asignado por el servidor en create/update), **nunca
  por label** — el label es `LocalizedString` y mutable, no sirve como identidad.
- Termina con `.strict()` — rechaza keys de campos que no existen en ESE formulario
  (defensa extra más allá del rate limiter en el submit público).
- `FormSubmissionModel` es una colección separada ligada por `formId` (mismo precedente que
  `PageRevisionModel`), con `data: Schema.Types.Mixed` como contraparte a nivel BD del schema
  dinámico. Soft-delete de un formulario NO cascada a sus respuestas (siguen en papelera,
  triageables); purge SÍ cascada (`FormSubmissionModel.deleteMany({formId})`).
- Permisos separados: `forms:*` (definición del formulario) vs `forms-submissions:*` (leer/
  borrar respuestas, sin `create`/`update` — nunca las autora un admin) — permite un rol
  "solo ve leads" sin poder editar el diseño del formulario.
- Notificación por email por-formulario (`Form.notificationEmails: string[]`), NO un
  "correo de admin" global en `app-settings` — un formulario de postulación laboral y uno de
  contacto notifican a gente distinta. Ver `FormSubmissionReceivedEvent` en
  `@Shared/events/emailEvents.ts` (patrón event-driven de la sección de abajo, `recipients`
  en plural con `Promise.allSettled`).

## RBAC y seguridad (Sprint 0 hecho)
- Permisos `recurso:accion` + comodín `recurso:manage` + super `*:*` (`@Constants/permissions`).
- **Purge (destrucción física) requiere `:purge` explícito o `*:*`** — `:manage` NO otorga
  purge. Las rutas `/permanent` y `/bulk/permanent` autorizan solo con `X_PURGE`.
  `SUPER_ADMIN_PERMISSIONS` = todo salvo `:purge` (super-admin que no destruye); `*:*` =
  super-root (sí destruye). Al añadir rutas de purge, gátealas solo con `X_PURGE`.
- `assertUserDeletable` impide auto-borrado y borrar el último super (`*:*`); bulk excluye
  al solicitante y a los super.
- `authLimiter` (5/min) en `/auth/login|forgot-password|reset-password`.
- Reset de password **un-solo-uso** vía `User.passwordChangedAt` (rechaza token con `iat`
  anterior al último cambio). Emails escapan HTML (`helpers/escapeHtml`).
- `captureAudit({ captureFailures:true })` audita no-2xx (hoy aplicado a login).
- Preferencias por-usuario: `User.preferences {language,theme}` +
  `PATCH /users/me/preferences`; expuestas en login y `GET /users/me`.
  (`primaryColor` se quitó: el color del admin quedó bloqueado al Manual de
  Marca en el frontend, sin selección por usuario.)

## Emails = outbox durable + worker (módulo `notifications-email`)
El envío es una **capacidad agnóstica centralizada dentro de first** (no un servicio
externo): una sola función `enqueueEmail({ to, subject, html })` que cualquier módulo
invoca (`import { enqueueEmail } from '@Modules/notifications-email'`). Arquitectura
outbox + worker, robusta en serverless:

- **`enqueueEmail`** persiste el correo en la colección **`email_outbox`** (status
  `pending`) y retorna de inmediato. **NO envía en línea** — así la latencia/fallos del
  proveedor nunca bloquean ni tumban el request. El request **sí espera** ese insert
  (es rápido y durable), a diferencia del viejo fire-and-forget que se perdía en
  serverless cuando la función se congelaba tras responder.
- **Worker `dispatchPendingEmails`** (`POST /api/v1/emails/dispatch`, protegido por
  `verifyDispatchRequest` = bearer `EMAIL_DISPATCH_SECRET`): reclama filas atómicamente
  (`pending` → `sending` con lease `lockedAt`, así dos invocaciones concurrentes no
  duplican, y recupera filas atascadas de una función muerta), envía por el transporte,
  y marca `sent` / reintenta / dead-letter (`failed`) tras `maxAttempts`. **A lo más un
  intento por fila por pasada** (reintentos en drenados separados, con backoff natural).
- **Trigger = QStash** (Upstash): un schedule llama a `/emails/dispatch` cada ~1 min con
  el header `Authorization: Bearer <EMAIL_DISPATCH_SECRET>`. Es config de infra (dashboard
  Upstash), no código. En `NODE_ENV=development` `enqueueEmail` además dispara un drenado
  in-process best-effort para probar local sin QStash.
- **Transporte agnóstico** (`infrastructure/transport/`): interfaz `EmailTransport` →
  `ResendTransport` (prod, `RESEND_API_KEY`) o `SmtpTransport` (dev/Ethereal, fallback).
  `getEmailTransport()` elige por env (`EMAIL_PROVIDER` / presencia de key). Cambiar de
  proveedor = env, sin tocar callers.
- Los 4 correos existentes siguen saliendo por **EventBus** (`@Shared/events/emailEvents`,
  productores `createUser`/`forgotPassword`/`verifyEmail`/`submitForm`); sus subscribers
  en `registerEmailSubscribers` ahora llaman `enqueueEmail` (path durable) en vez de
  enviar inline.

**Para un correo nuevo:** si nace de un evento de dominio, define el evento en
`@Shared/events`, publícalo en el productor, y en `registerEmailSubscribers` renderiza el
template y llama `enqueueEmail`. Si un módulo solo quiere "manda este correo" sin evento,
llama `enqueueEmail` directo. **Nunca** envíes inline con el transporte dentro de un caso
de uso de negocio.

## Tests
- Unit: mockear el modelo/dependencias. Integración: `withMongo()` (real, en memoria).
- Casos de subida: mockear `@Modules/storage` (`uploadImageSafe`, `deleteEntityFiles`,
  `deleteStorageFilesByIds`) devolviendo **promesas resueltas** (el código hace `.catch`).
- Tras cambios, deja **lint + typecheck + suite** en verde antes de cerrar.

## Deploy (Vercel) y flujo de ramas
**Flujo (desde 2026-06-14): SOLO existe `main`. Todo sale por `feature/*` desde `main`** → PR →
merge a `main`. No hay `develop` ni `release` (se eliminaron, junto con ramas y worktrees viejos).
Como la feature nace de `main`, **el merge de vuelta es limpio** (comparten ancestro) — se acabó el
dolor de las historias disjuntas/cherry-pick que había entre develop↔main.
Auto-deploy por rama vía GitHub: `feature/*`→Preview, `main`→**Production** (proyecto
`prj_rnqv2qn0dktQNctPZFPOfobo0JTL`, team `team_HlO61rBCXDgQTkK5byfxEoEk`). Health:
`GET /api/v1/health` (200 + `db:connected`, o 503 si Mongo no conecta). Dominios prod:
`first-backend-navike21.vercel.app`, `first-backend-alpha.vercel.app`.
- **Env vars (Vercel).** `MONGO_URI`+`MONGO_DATABASE` son las **únicas requeridas**
  (`environments.ts` hace `process.exit(1)` si faltan → `FUNCTION_INVOCATION_FAILED`). `NODE_ENV`
  sólo acepta `development|production|test` (un valor inválido **crashea** igual que si faltara).
  Hoy **ni Preview ni Production tienen `NODE_ENV`** → default `development`. Feature previews usan el
  scope **Preview genérico** (`MONGO_URI`, `MONGO_DATABASE=first-db__release`, JWT, email). *(Prod
  corre en modo dev: Ethereal en vez de SMTP real; si se quiere SMTP real + chequeo de JWT seguros,
  setear `NODE_ENV=production` en Production.)*
- **Para cambiar env vars usa el Vercel CLI** (`vercel env ls|add|rm`, logueado como `jose-chaponan`,
  proyecto linkeado en `.vercel/project.json`). Los scripts `scripts/setup-env*.mjs` leen el token de
  `auth.json` que está **muerto (403)** — no los uses para mutar; el CLI v51 usa otro auth. `add`/`rm`
  aceptan rama (`vercel env add NAME preview <branch> --value X --yes`); el genérico **sin rama** se
  traba en el guard no-interactivo del plugin (workaround: borrarlo para caer al default, o dashboard).

## Email en producción (outbox + QStash + Resend) — acciones manuales
El código quedó listo; para que entregue en prod hace falta setear env + infra (nada de
esto lo hace el código):
- **Resend:** crear cuenta, verificar el dominio de envío (SPF/DKIM), y setear
  `RESEND_API_KEY` + `EMAIL_FROM` (dirección del dominio verificado). Con la key,
  `EMAIL_PROVIDER=auto` ya elige Resend.
- **QStash (Upstash):** crear un schedule que haga `POST https://<backend>/api/v1/emails/dispatch`
  cada ~1 min, con el header `Authorization: Bearer <EMAIL_DISPATCH_SECRET>`.
- **Env vars Vercel:** `EMAIL_DISPATCH_SECRET` (random fuerte; sin él en prod el endpoint
  responde 503 fail-closed), `RESEND_API_KEY`, `EMAIL_FROM`. Opcionales con default:
  `EMAIL_OUTBOX_MAX_ATTEMPTS` (5), `EMAIL_OUTBOX_LEASE_MS` (60000), `EMAIL_OUTBOX_BATCH_SIZE` (25).
- Sin nada de esto, dev sigue funcionando con Ethereal + drenado in-process.

## Pendientes (no perder de vista)
- ⚠️ **Acción MANUAL del usuario** (no la hace el código): rotar la credencial de Atlas
  `navike21_account`, la password del super-admin y **`EMAIL_PASS`** (pasaron por el chat / aparecen
  en `vercel env ls`; rotar en sus consolas y actualizar el env de Vercel).
- Validar una **subida real contra Vercel** (límite de body serverless).
- Asegurar el uso de multipart para el resto de los módulos en el frontend (`clients`, `collaborators`,
  `portfolio`, `services`, `app-settings`) cuando se desarrollen en el front. El módulo `users` ya
  fue migrado y utiliza el contrato multipart.
