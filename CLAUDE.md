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
subscribers, storage, audit-log, app-settings, notifications-email, health.
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
- Preferencias por-usuario: `User.preferences {language,primaryColor,theme}` +
  `PATCH /users/me/preferences`; expuestas en login y `GET /users/me`.

## Emails = event-driven (no bloquean el request)
Los emails se envían vía **EventBus** (`@Shared/infrastructure/EventBus`), no en línea.
Productores (`createUser`, `forgotPassword`, `verifyEmail`) **publican** un evento de
`@Shared/events/emailEvents`; el suscriptor `notifications-email/registerEmailSubscribers`
(registrado en `initApp`) envía **fire-and-forget** (un fallo de SMTP se loguea y no rompe
el request). Para añadir un email nuevo: define el evento en `@Shared/events`, publícalo
en el productor, y suscríbelo en `registerEmailSubscribers`. No vuelvas a `await sendEmail`
dentro de un caso de uso de negocio.

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

## Pendientes (no perder de vista)
- ⚠️ **Acción MANUAL del usuario** (no la hace el código): rotar la credencial de Atlas
  `navike21_account`, la password del super-admin y **`EMAIL_PASS`** (pasaron por el chat / aparecen
  en `vercel env ls`; rotar en sus consolas y actualizar el env de Vercel).
- Validar una **subida real contra Vercel** (límite de body serverless).
- Asegurar el uso de multipart para el resto de los módulos en el frontend (`clients`, `collaborators`,
  `portfolio`, `services`, `app-settings`) cuando se desarrollen en el front. El módulo `users` ya
  fue migrado y utiliza el contrato multipart.
