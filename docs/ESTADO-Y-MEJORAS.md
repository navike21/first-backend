# First-Backend — Estado actual y plan de mejoras

> Sesión de análisis: **2026-06-12**. Documento vivo. Su propósito es evitar
> re-escanear el código en sesiones futuras. Si cambias algo de lo aquí descrito,
> **actualiza este archivo**. Las rutas `file:line` son válidas a la fecha del análisis.

## 0. Objetivo de First (norte del producto)
Herramienta multipropósito (paso a paso) para: gestión/administración de páginas web,
ecommerce, flujos de venta física/virtual → **CRM + CMS** en una sola plataforma.
Prioridades de ingeniería: arquitectura entendible y escalable, middlewares claros,
**máxima reutilización** (no duplicar utilitarios), todo lo destructivo auditado.

---

## 1. Lo que está bien (no tocar, ya cumple)
- **Storage es agnóstico de proveedor** ✅. `STORAGE_DRIVER` (env) + factory en
  `modules/storage/infrastructure/StorageService.ts` con 4 drivers reales:
  `VercelBlobDriver`, `S3Driver`, `GCSDriver`, `AzureBlobDriver`. Interfaz mínima
  `StorageDriver { uploadBuffer, delete }` (`domain/StorageDriver.ts`).
- **Procesamiento de imágenes en backend** ✅. `ImageProcessor.ts` (sharp) genera
  `full` (≤2000px) + `thumb` (700px, cover) en webp; SVG/raster diferenciados.
- **Validación de archivo por contenido** ✅. `middlewares/validateFileType.ts` valida
  magic-bytes (`file-type`) vs MIME declarado y comprueba `<svg`/`<?xml` en SVG.
- **Borrado físico de storage limpia las 3 variantes** ✅
  (`application/deleteFilesPermanent.ts` borra original+full+thumb).
- **Soft-delete + hard-delete (purge) + papelera + bulk** consistente en casi todos
  los módulos.
- **RBAC tipo AWS** ✅. `constants/permissions.ts`: `recurso:accion`, comodín
  `recurso:manage` y super `*:*`. Grupos validan permisos contra `ALL_PERMISSIONS`.
  Grupos `isSystem` protegidos de borrado (`deleteUserGroupLogical.ts`).
- **JWT con secretos separados por tipo** (access/refresh/email) y validación de
  secretos inseguros en producción (`constants/environments.ts:79`).
- **Helmet + CSP + HSTS + CORS whitelist + compression** (`config/app.ts`).
- **i18n de errores en 10 idiomas**, `ResponseStructure`, `asyncHandler`, `AppError`.

---

## 2. HALLAZGOS CRÍTICOS DE SEGURIDAD (resolver primero)

### 2.1 🟠 Secretos hardcodeados en scripts locales (CORREGIDO — NO era fuga de git)
**Corrección 2026-06-12:** la evaluación original ("versionadas en el historial de git") era
**errónea**. `.gitignore` línea 9 ignora **todo `scripts/`**, así que `seed-super-admin.js`,
`setup-env.mjs` y `setup-env-preview.mjs` **nunca se commitearon ni se subieron a GitHub**.
No hay fuga pública ni hace falta purgar historial.
Lo que SÍ era real: esos scripts tenían en texto plano el `MONGO_URI` de Atlas
(`navike21_account:...`), los **9 JWT secrets** y `EMAIL_PASS` (y los subían a Vercel como
`type: 'plain'` = visibles); la password del super-admin `Admin2026$` era débil y compartida
entre tiers. Además esos valores pasaron por el chat → conviene rotarlos.

**Hecho (código):** los 3 scripts ya **no hardcodean secretos** (leen de `process.env`);
`setup-env-preview` ahora marca los secretos como `encrypted` en Vercel. Tooling de rotación:
`scripts/generate-secrets.mjs` (genera JWT secrets frescos a `scripts/.env.rotation`,
gitignored, sin imprimirlos) y `scripts/reset-super-admin-password.js` (rota la password del
super-admin). **Acción MANUAL del usuario:** rotar la password del usuario de Atlas y del
correo en sus consolas, llenar `scripts/.env.rotation`, y re-correr setup-env (runbook en chat).

### 2.2 ✅ CORREGIDO — `authLimiter` definido pero NUNCA usado (dead code)
`config/limiter.ts:15` define `authLimiter` (5/min) pero `modules/auth/routes/route.ts`
no lo importaba. Login, **forgot-password** y **reset-password** solo tenían el límite
global (100/min) → fuerza bruta de credenciales y *email bombing* viables.
**Hecho:** Se aplicó `authLimiter` a `/auth/login`, `/auth/forgot-password` y
`/auth/reset-password/:token` (usando keyGenerator por email+IP).

### 2.3 ✅ CORREGIDO — Token de reset de contraseña reutilizable (no single-use)
`application/resetPassword.ts` valida un JWT (`JwtService.verifyEmail`) sin marca de
un solo uso. El mismo token servía hasta expirar (1h) aunque ya se haya usado.
**Hecho:** Se invalidan los tokens de reset tras el primer uso comparando la fecha de
emisión (`iat`) con `User.passwordChangedAt`. `verify-email` ya era de un solo uso por el
guard de `isEmailVerified:false`.

### 2.4 ✅ CORREGIDO — Inyección de HTML en plantillas de email
Las plantillas (`templates/*.template.ts`) interpolaban `firstName` y `resetUrl` directo
en el HTML sin escapar. `firstName` es controlado por el usuario.
**Hecho:** Se escapan las entidades HTML de todo valor dinámico (`firstName`) con el
helper `helpers/escapeHtml.ts` antes de interpolar.

### 2.5 ✅ CORREGIDO — El usuario super-admin no está protegido contra borrado
Los **grupos** `isSystem` estaban protegidos, pero el **usuario** super-admin no:
`deleteUserLogical.ts` y `deleteUser.ts` no verificaban auto-borrado ni "último super".
Cualquiera con `users:delete` podía dejar el sistema sin administradores.
**Hecho:** Se implementó `assertUserDeletable` para impedir auto-borrado y borrar el
último super-admin con permisos `*:*`. Los procesos bulk excluyen al solicitante y a los super.

### 2.6 ✅ CORREGIDO — La auditoría solo registra éxitos (2xx)
`audit-log/middlewares/captureAudit.ts` corría en `res.on('finish')` y solo persistía si
`statusCode` ∈ [200,300). Los intentos **fallidos** (login inválido, borrado sin permiso,
403) no quedaban registrados.
**Hecho:** Se auditan los fallos (no-2xx) con `success:false` + `statusCode` (aplicado a login).
Además, `errorMiddleware` registra `access:denied` para cualquier respuesta 403.

---

## 3. BRECHAS FUNCIONALES vs REQUISITOS

### 3.1 ✅ RESUELTO (2026-06-12) — preferencias por-usuario implementadas
Se añadió `User.preferences { language?, primaryColor?, theme: 'light'|'dark'|'system' }`
(subdoc Mongoose, `theme` default `'system'`), endpoint `PATCH /users/me/preferences`
(`updateMyPreferences`, merge parcial), schema `UpdatePreferencesSchema`, y las
preferencias + `profilePictureUrl` se exponen en la respuesta de **login** y en
`GET /users/me` para que el front las aplique al entrar. La "foto del usuario" es
`profilePictureUrl` (subible vía `avatar`, Fase 2). El `app-settings` singleton sigue para
config de organización. i18n `PREFERENCES_UPDATED` x10. Tests: use-case + controller.
Texto original del hallazgo abajo (histórico).

### 3.1 (histórico) app-settings es un SINGLETON GLOBAL, no preferencias por-usuario
**Requisito:** al loguearse, el usuario configura *lenguaje, color primario, tema
(dark/light/system) y foto ligada a su usuario*.
**Realidad:** `app-settings` es config global única (`id: 'singleton'`): `appName`,
`timezone`, `maintenanceMode`, sender de email, `logoUrl/primaryColor/faviconUrl`.
No hay entidad de preferencias por-usuario y **no existe el campo `theme`

### 3.2 ✅ RESUELTO — Subida de archivos cross-módulo NO cumple el patrón pedido
**Requisito:** El API de registrar debe aceptar un archivo; el backend sube y procesa.
**Hecho:** Se implementó el middleware `acceptImage` y el helper `uploadImageSafe` (no bloqueante).
Los módulos `clients`, `users`, `collaborators`, `portfolio`, `services` y `app-settings` fueron
migrados al patrón `multipart/form-data` con la clave `data` (JSON) + archivo, delegando la subida
y la limpieza en update/purge al backend. El frontend (módulo `users`) ya se migró a este contrato.

### 3.3 ✅ RESUELTO — clients — naming y cobertura cross-región
- Añadidos campos `postalCode`, `email`, `phone`, `language` y `currency` (opcionales) en el modelo y esquema.
- El rename de `businessName` a `displayName` se difiere por retrocompatibilidad.
- Validaciones en LATAM+EU+US configuradas.

### 3.4 ✅ RESUELTO — users vs collaborators — NO son lo mismo (separación correcta, naming confuso)
- **Hecho:** Se añadió `userId?` (uuid) a `collaborators` para vincular un perfil público a un usuario interno.
- El **rename del módulo** `collaborators → team-members` se difirió por ser un cambio breaking cross-repo.

### 3.5 ✅ RESUELTO — notifications-email — correcto pero acoplado y síncrono
- **Hecho:** Desacoplado vía `EventBus` (`UserRegisteredEvent`, `PasswordResetRequestedEvent`, `EmailVerifiedEvent`).
- Los correos se envían de forma asíncrona (*fire-and-forget*), evitando latencia en el request path.
- La marca "First Backend" fue removida de las plantillas e inyectada dinámicamente desde `appSettings`.

### 3.6 ✅ RESUELTO — user-groups (RBAC) — falta distinción super y enforcement de purge
- **Hecho:** Se restringió el purge físico a nivel arquitectura. La destrucción requiere permiso `:purge` explícito o `*:*` (el rol `*:*` = super-root, mientras que `super-admin` tiene todo excepto `:purge`).
- Las 17 rutas de purge se actualizaron para autorizarse únicamente con `X_PURGE`. + tests.

---

## 4. DEUDA TÉCNICA / REUTILIZACIÓN (alineado con "no crear cosas 2 veces")

### 4.1 ✅ RESUELTO — Validación inconsistente entre módulos
- **Hecho:** Se implementó `helpers/validate.ts` y se migraron los ~56 controllers al uso unificado de `validate()` / `validateArray()`, devolviendo error 422 estandarizado. Se eliminaron los middlewares de validación redundantes de `subscribers`.

### 4.2 ✅ RESUELTO — EventBus existe pero NINGÚN módulo lo usa (infraestructura muerta)
- **Hecho:** EventBus adoptado para la gestión asíncrona de correos en auth y registro de usuarios.

### 4.3 ✅ RESUELTO — Observaciones menores
- Límite de body de express ajustado a `1mb`.
- Caching de app-settings mantenido para mono-instancia.
- El seed se parametrizó sin secretos hardcodeados.

---

## 5. ROADMAP SUGERIDO (orden por riesgo/valor)

**Sprint 0 — Seguridad — ✅ COMPLETADO 2026-06-12** (264 archivos / 897 tests verdes)
1. ✅ Seed sin secretos: `scripts/seed-super-admin.js` lee de env (`MONGO_URI`,
   `SUPER_ADMIN_PASSWORD`, `SEED_DATABASES`, `SUPER_ADMIN_EMAIL`); se eliminaron la URI
   de Atlas y la password hardcodeadas.
   - ⚠️ **ACCIÓN MANUAL TUYA (no la puede hacer el código):** rotar en Atlas la credencial
     `navike21_account` y la password del super-admin (estuvieron en texto plano en scripts
     locales — `scripts/` está gitignored, NO se subieron a GitHub; aun así pasaron por el
     chat → rotar por higiene). No hace falta purgar historial.
2. ✅ `authLimiter` (5/min) aplicado a `/auth/login`, `/auth/forgot-password`,
   `/auth/reset-password/:token`.
3. ✅ Reset de contraseña **un-solo-uso** vía `User.passwordChangedAt` (se rechaza un token
   con `iat` anterior al último cambio); `changePassword` también lo actualiza.
   verify-email ya era single-use (guard `isEmailVerified:false`). + HTML escapado en las
   3 plantillas de email (`helpers/escapeHtml.ts` sobre `firstName`).
4. ✅ Protección de super-admin: `assertUserDeletable` (no auto-borrado + no borrar el
   último super con `*:*`) en delete lógico y físico; los bulk excluyen al solicitante y a
   los super. Errores `CANNOT_DELETE_SELF` (403) / `LAST_SUPER_ADMIN` (409) con i18n x10.
5. ✅ Auditoría de fallos: opción `captureFailures` en `captureAudit` (registra no-2xx con
   `success:false` + statusCode); aplicada al login. Nota: cobertura amplia de 403 en otros
   endpoints queda como mejora futura (hoy solo login).

**Sprint 1 — Patrón de archivos cross-módulo (3.2)**
- Middleware `acceptImage` + helper `attachUploadedImage` (no bloqueante) + migrar
  clients/users/collaborators/portfolio/services a multipart.

**Sprint 2 — Preferencias de usuario (3.1) — ✅ COMPLETADO 2026-06-12**
- ✅ `User.preferences { language, primaryColor, theme }` + `PATCH /users/me/preferences`.
- ✅ Expuestas en login y `GET /users/me` para que el front aplique tema/idioma/color al
  entrar. Foto = `profilePictureUrl`. Suite: 265 archivos / 903 tests.

**Sprint 3 — Modelo de datos cross-región y RBAC — ✅ COMPLETADO 2026-06-12**
- ✅ **3.3 clients cross-región**: añadidos `postalCode`, `email` y `phone` a nivel empresa,
  `language` (ISO) y `currency` (ISO 4217, uppercase) — todos opcionales (schema + modelo).
  ⏳ El rename de `businessName` (confuso para `person`) se deja como cambio cosmético/breaking
  pendiente (hoy `businessName` actúa como display name).
- ✅ **3.4 collaborators**: añadido `userId?` (uuid, `ref: 'User'`) para vincular un perfil
  público a un usuario interno sin duplicar identidad. ⏳ El **rename del módulo**
  `collaborators → team-members` se DEFIERE: es breaking y cross-repo (permisos
  `COLLABORATORS_*`, audit actions, i18n, Insomnia, frontend) — requiere confirmación
  explícita; no se hace sin pedirlo.
- ✅ **3.6 purge gating / super tiers**: la destrucción física ahora exige `:purge`
  explícito o `*:*` — `:manage` ya **no** otorga purge (`hasPermission` ajustado) y las **17
  rutas de purge** pasaron de `authorize(X_PURGE, X_MANAGE)` a `authorize(X_PURGE)`.
  Constante `SUPER_ADMIN_PERMISSIONS` (todo salvo `:purge`) para crear un super-admin que NO
  puede destruir; `*:*` = super-root (sí destruye). + tests.

**Sprint 4 — Desacople y consistencia — ✅ COMPLETADO 2026-06-12**
- ✅ **EventBus para emails (4.2)** — 2026-06-12. Eventos en `@Shared/events/emailEvents`
  (`UserRegisteredEvent`, `PasswordResetRequestedEvent`, `EmailVerifiedEvent`); suscriptor
  `notifications-email/application/registerEmailSubscribers` (registrado en `initApp`) que
  envía **fire-and-forget** (un fallo de SMTP ya NO rompe `createUser`/`forgotPassword`/
  `verifyEmail` ni añade latencia). Productores publican el evento; ya no importan
  notifications-email. Suite: 266 archivos / 907 tests.
  - ⏳ Sigue pendiente de §3.5: el brand "First Backend" hardcodeado en plantillas (inyectar
    `appSettings.appName`/sender); y un **bus durable** (cola) si se requiere garantía de
    entrega (hoy es in-memory in-process).
- ✅ **`validate()` unificado (4.1)** — 2026-06-12. Helper compartido `helpers/validate.ts`
  (`validate(schema, data)` + `validateArray`) que lanza el 422 estándar. `subscribers`
  migrado: se eliminaron sus 3 middlewares ad-hoc (`validateSchema`/`SchemaArray`/`Update`)
  + sus tests; la coacción de `dateOfBirth` (ISO→Date) se movió al schema (`z.preprocess`);
  los controllers validan inline con `validate()`. (Corrección al hallazgo: `types/` NO era
  duplicado — es el tipo `SubscriberSchema` compartido por modelo/use-cases/schemas; se
  mantiene.) De paso, typecheck destapó un mismatch real ya existente (update aceptaba
  deep-partial pero el use-case pedía Partial con `email` requerido) → tipado con
  `UpdateSubscriberInput`.
  - ✅ **Migración completa (2026-06-12)**: los **~56 controllers** pasaron a `validate()`/
    `validateArray()` (51 vía script + 5 a mano por tener 2 bloques/indentación distinta).
    **No queda ningún `safeParse` inline** en controllers. Bonus de consistencia:
    `app-settings.update` y `audit-log.list` validaban con `badRequest` (400) → ahora todos
    devuelven **422** uniforme.

---

### Leftovers de seguridad/consistencia — ✅ CERRADOS 2026-06-13
- **3.5 brand de emails desde appSettings**: las plantillas ya no hardcodean "First Backend".
  El i18n usa `{{appName}}`; el suscriptor resuelve `appSettings.general.appName` (defensivo,
  default 'First Backend') y lo pasa escapado a las 3 plantillas (h1 + footer + subject welcome).
- **4.3 límite de body**: `express.json`/`urlencoded` capados a `1mb` (las subidas usan multipart
  vía multer, no este parser).
- **2.6 auditoría de 403 AMPLIA**: `errorMiddleware` registra `access:denied` en el audit-log
  para **cualquier** respuesta 403 (no solo login), con `code/method/path/ip/userAgent`.

## 6. Notas para el módulo `pages`
Se revisa en sesión aparte (pedido del usuario). No incluido aquí.

## 7. PATRÓN OFICIAL DE ARCHIVOS CROSS-MÓDULO + PLAN (FIJADO 2026-06-12)

Reemplaza la "Propuesta" de §3.2. Este es el contrato y el plan acordados.

### 7.1 Decisiones fijadas
- **Transporte = PROXY.** El front manda en **un solo request** la info + el archivo;
  el backend valida, sube y registra. (Se descarta URL firmada porque obligaría al front
  a orquestar la subida, violando "el front solo manda información".)
  - **Restricción Vercel:** las funciones serverless limitan el body (~4.5 MB) y el tiempo.
    Por eso el cap de entrada de **imágenes** se baja a **4 MB**. Documentos grandes y/o
    subida directa con URL firmada quedan **fuera de alcance** (fase futura).
- **Contrato multipart:** un part **`data`** (JSON con el body completo) + un part de
  **archivo** con nombre por módulo (`logo`, `avatar`, `photo`, `cover`, `image`).
  Así los schemas Zod (que esperan objetos anidados/booleanos/números) **no cambian**:
  el controller hace `JSON.parse(req.body.data)` antes de validar.
- **Imagen = adjunto NO bloqueante** por defecto (el registro vale sin ella);
  configurable por módulo si alguna imagen es semánticamente obligatoria.
- **Ancla de ciclo de vida:** la entidad guarda solo la **URL**; el `StorageFileModel`
  (con `entityType` + `entityId`) es el ancla para limpieza en update-reemplazo y purge.
  No se añade campo nuevo a las entidades en la fase 1.
- **Claves de unicidad por módulo** (pre-check UX + índice único = verdad):
  - `users` → `email` (ya existe).
  - `clients` → **índice único parcial** `(documentType, documentNumber, country)` con
    `partialFilterExpression: { documentNumber: {$exists:true}, deletedAt: null }`
    (permite clientes sin documento). *Decisión revisable.*
  - `collaborators` / `services` / `portfolio` → `slug`.
  - `subscribers` → `email`.

### 7.2 Secuencia canónica (CREATE)
1. (middleware) multipart + validación de tipo por *magic bytes* → 415.
2. (controller) `JSON.parse(req.body.data)` + Zod → 422.
3. (use-case) **pre-check de duplicado** por la clave del módulo → 409.
4. **pre-generar `id` (UUID)**.
5. **`uploadImageSafe`** (try/catch, nunca lanza) → `{ url? , warning? }`.
6. **insert** con `url ?? null`. Si Mongo lanza `E11000` (carrera) → `deleteEntityFiles`
   (compensación) + 409.
7. **201** `{ data, warnings: warning ? [warning] : [] }`.

Desenlaces reales (3, no 4): data+subida OK → 201 · data OK + subida FALLA → 201+warning ·
data FALLA → 4xx (no sube ni guarda).

### 7.3 Secuencia UPDATE (distinta)
Subir nueva → si el update DB va OK, `deleteEntityFiles` de la **vieja**; si la **subida
falla**, conservar la vieja + warning; si el **update falla**, compensar borrando la nueva.

### 7.4 Piezas reutilizables (no duplicar por módulo)
- `middlewares/errorMiddleware.ts`: mapear `E11000` → 409 `RESOURCE_DUPLICATE` (una vez).
- `helpers/responseStructure.ts` + `types/responseStructure.ts`: canal `warnings[]`
  (`ResponseWarning { field, code, message }`) en `successResponse` y `ApiResponse`.
- `modules/storage/application/uploadImageSafe.ts`: wrapper no-lanzante.
- `modules/storage/application/deleteEntityFiles.ts`: borra blobs+records por entity.
- `modules/storage/middlewares/acceptImage.ts`: factory `[multerSingle + validateFileType]`.
- Lo único por módulo: `assertXUnique` (query) + el modelo. El resto es **plantilla**.

### 7.5 Plan de implementación

**Fase 0 — Infra compartida (sin tocar módulos de negocio) — ✅ COMPLETADA 2026-06-12**
1. ✅ `errorMiddleware`: `E11000` → 409 `RESOURCE_DUPLICATE` (solo expone nombres de
   claves, no valores) + claves i18n en los 10 locales.
2. ✅ `responseStructure`/types: `ResponseWarning` + `warnings[]` en `SuccessResponseOptions`
   y `ApiResponse`; `successResponse` traduce los warning codes contra el ns `errors`
   (retrocompatible: solo aparece `warnings` si hay al menos uno).
3. ✅ `storage/application/uploadImageSafe.ts` (nunca lanza; `full.url ?? original.url`).
4. ✅ `storage/application/deleteEntityFiles.ts` (borra por `entityType+entityId`,
   resiliente con `Promise.allSettled`).
5. ✅ `storage/middlewares/acceptImage.ts` (cap `STORAGE_MAX_IMAGE_SIZE_BYTES`=4 MB,
   `IMAGE_MIME_TYPES`, imagen opcional). Requirió: opción `required` en `validateFileType`
   + env `STORAGE_MAX_IMAGE_SIZE_BYTES`.
   - Exportadas en `modules/storage/index.ts`: `uploadImageSafe`, `deleteEntityFiles`,
     `acceptImage` (+ tipos).
   - Tests: 33 nuevos/extendidos. Suite storage+middlewares+helpers: **177 pasando**.
     De paso se corrigió un test desactualizado preexistente en `storage/routes`
     (contaba 1 PATCH; hay 2 desde que se añadió bulk-restore).

**Fase 1 — Piloto en `clients` — ✅ COMPLETADA 2026-06-12**
6. ✅ Índice único parcial `(documentType, documentNumber, country)` en ClientModel
   (`partialFilterExpression: { documentNumber: {$exists:true}, deletedAt: null }`)
   + `application/assertClientUnique.ts`. Se reemplazó la unicidad por `businessName`
   (frágil) por la del documento: `ClientBusinessNameConflictError` →
   `ClientDuplicateDocumentError` (code compartido `RESOURCE_DUPLICATE`).
7. ✅ `createClient(input, file?, uploadedBy?)` con la secuencia §7.2 (dedup → uuid →
   `uploadImageSafe` → insert → compensación `deleteEntityFiles` en E11000).
8. ✅ Controllers `client.create`/`client.update` a multipart vía helper compartido
   `helpers/multipartRequest.ts` (`parseRequestData` + `getUploadedFile`); devuelven
   `warnings`. Tipos nuevos: `types/incomingFile.ts`, `MutationResult<T>`.
9. ✅ Rutas create + update con `...acceptImage('logo')`.
10. ✅ `updateClient` con reemplazo §7.3 (sube nueva → `deleteEntityFiles` con
    `exceptStorageIds`; compensa con `deleteStorageFilesByIds` si el save falla).
    `deleteClientPhysical` y `purgeClientsBulk` → `deleteEntityFiles`. Infra nueva:
    `removeStorageBlobs`, `deleteStorageFilesByIds`, opción `exceptStorageIds`.
11. ✅ Tests (success / parcial / duplicado / compensación). Módulos tocados: **230 pasando**.
    ⏳ Pendiente: validar subida real contra Vercel (requiere despliegue/credenciales).

### Saneamiento de deuda preexistente de tests — ✅ COMPLETADA 2026-06-12
- **17 tests rojos preexistentes saneados** (12 archivos en users, collaborators, pages,
  portfolio, services, subscribers, user-groups). Confirmados en HEAD limpio vía
  `git stash` (no introducidos por este trabajo). Causa común: asumían un
  `status: 'deleted'` inexistente en los enums (solo `active`/`inactive`) o filtros
  `status: {$ne:'deleted'}`. El soft-delete real usa `deletedAt`. Se ajustaron las
  aserciones/seeds al comportamiento real **sin tocar la lógica de producción**:
  - delete-físico: sembrar con `deletedAt` (el hard-delete exige estar en papelera).
  - soft-delete: aserción sobre `deletedAt` (no sobre status).
  - list/get: filtros esperados con `deletedAt: null` (admin) y `+deletedAt:null` (público).
  - `portfolioStatus`: quitado el `toContain('deleted')`.
- **Suite completa ahora en verde: 262 archivos / 886 tests.**

### Saneamiento de lint — ✅ COMPLETADA 2026-06-12
El lint del proyecto completo tenía **21 errores + 2 warnings** (no 3 — la cifra inicial
solo cubría `clients`, el único dir escaneado entonces):
- **20 errores `sonarjs/no-nested-conditional`**: ternario anidado para el `code` en los
  bulk controllers de 8 módulos (clients, collaborators, pages, portfolio, services,
  storage, subscribers, user-groups, users). Resuelto con un helper compartido
  `helpers/bulkOutcome.ts` (`processedIds`/`notFoundIds` → `NONE|PARTIAL|SUCCESS`) +
  template-literal `` `PREFIX_${bulkOutcome(data)}` `` (mismos códigos de respuesta,
  cero impacto i18n). 23 controllers migrados (incluidos los 3 de clients hechos a mano).
- **1 import sin usar** (`STATUS_REGISTER_ARRAY`) en `storage/schemas/storage.schema.ts`.
- **2 warnings**: var sin usar (mismo import) y un `opts` sin usar en un test propio.
- Resultado: `npx eslint src/` **0 problemas**. Suite: **263 archivos / 889 tests**.

### ⚠️ Deuda preexistente aún pendiente (menor)
- Warnings de mongoose (`new` option en `findOneAndUpdate` deprecado) en varios módulos
  (solo deprecación, no rompe).

### Cambio de contrato para el frontend (cierre en Fase 3)
`POST /clients` y `PATCH /clients/:id` aceptan ahora **multipart**: part `data` (JSON) +
part `logo` (archivo opcional); siguen aceptando JSON puro si no hay archivo. La respuesta
puede incluir `warnings[]`. El front debe dejar de subir a `/storage` por separado.

**Fase 2 — Replicar la plantilla — ✅ COMPLETADA 2026-06-12**
12. ✅ Migrados al patrón de subida backend (multipart `data` JSON + archivo, no
    bloqueante, `MutationResult { data, warnings }`, reemplazo en update, cleanup en
    purge):
    - **users** → `avatar` (`profilePictureUrl`), `entityType: 'users'`. En create +
      update (`/users/:id`) + perfil propio (`/users/me`). `applyUserUpdate` compartido.
      Nueva constante `users/constants/entity.ts`.
    - **collaborators** → `photo` (`photoUrl`), sin clave de unicidad.
    - **portfolio** → `cover` (`coverImageUrl`). La portada es **requerida**: se hizo
      `coverImageUrl` opcional en Zod y `createPortfolio` exige cover efectivo (archivo
      o URL) → `PORTFOLIO_COVER_REQUIRED`.
    - **services** → `cover` (`coverImageUrl`, ya opcional).
    - **app-settings** → `logo` + `favicon` (singleton). Requirió helper multi-campo
      nuevo `storage/middlewares/acceptImageFields.ts` (multer `.fields`) + helper
      `getUploadedFileField`. Cada imagen usa su propio ancla (`entityId: 'logo'|'favicon'`)
      para reemplazo independiente. El controller inyecta `appearance:{}` cuando solo
      llega archivo (para pasar el refine de "al menos una categoría").
13. ✅ Infra compartida ampliada: `validateSingleFile` y `toAppError` exportados;
    `acceptImageFields` + `getUploadedFileField`. Todas las rutas create/update de estos
    módulos llevan `...acceptImage(field)` (o `acceptImageFields` en app-settings).
14. ✅ Verificación: **263 archivos / 890 tests** en verde, lint y typecheck limpios.
    ⏳ Pendiente común (todas las fases): validar subida real contra Vercel.

> Nota: el contrato multipart de estos endpoints cambió (igual que clients). El front
> debe migrarse en la Fase 3 (dejar de orquestar la subida a `/storage`).

**Fase 3 — Contrato para el front + cierre — ✅ COMPLETADA 2026-06-12**
13. ✅ Contrato multipart documentado en **`docs/API-UPLOADS.md`** (formatos multipart/JSON,
    tabla de endpoints/campos, restricciones, respuestas con `warnings[]`, tabla de errores).
14. ✅ Colección Insomnia (`docs/insomnia.collection.json`) actualizada: los 12 requests de
    create/update afectados (clients, users ×3, collaborators, portfolio, services,
    app-settings) convertidos a `multipart/form-data` (part `data` JSON + parts de archivo),
    sin el `Content-Type: application/json`, con nota descriptiva.
15. ✅ Checklist de migración del front incluido en `docs/API-UPLOADS.md` §6.
    ⏳ La ejecución de la migración en el repo `first-frontend` queda para esa sesión.

> Nota: este patrón es **independiente** del Sprint 0 de seguridad (§5); pueden ir en
> paralelo. La Fase 0 no toca lógica de negocio, así que es de bajo riesgo.

## 8. Auditoría de seguridad + concurrencia/alta-demanda — ✅ COMPLETADA 2026-07-14

Pedido explícito del usuario: brechas de seguridad + soporte de múltiples
usuarios concurrentes bajo alta demanda + buenas prácticas de lint/test. No
re-escanear lo de abajo salvo que cambie el código referenciado.

### Hallazgos y fixes
- **CORS fail-open** (`config/cors.ts`): si `WHITELISTED_DOMAINS` está vacío,
  el código reflejaba cualquier origin con `credentials:true` (cualquier
  sitio podía hacer requests autenticadas con cookies). **Fix:** fail-closed
  — sin whitelist configurada, se deniega cualquier origin (con `origin`;
  requests sin `origin` —server-to-server/Postman— siguen permitidas). Test
  en `config/cors.test.ts`.
- **ReDoS + `$regex` sin escapar** en 9 módulos (clients/categories/
  collaborators/pages/tags/storage/subscribers/user-groups/users): el
  parámetro `search` se interpolaba directo en `$regex`/`new RegExp()` sin
  escapar metacaracteres — un patrón tipo `(a+)+` podía colgar de CPU al
  `mongod` compartido, afectando a **todos** los usuarios concurrentes.
  **Fix:** helper `helpers/escapeRegex.ts` aplicado en los 9 sitios +
  `.max(200)` en los schemas de `search` que no lo tenían (solo `storage`
  ya lo tenía). `subscriber.listAll` además pasó a validar con Zod
  (`ListSubscribersQuerySchema`) en vez de parsear `req.query` a mano.
- **Race condition (TOCTOU) en el guard de "último super-admin"**
  (`users/application/assertUserDeletable.ts`): el chequeo "¿queda otro
  super activo?" era check-then-act sin lock — dos borrados individuales
  concurrentes de los últimos 2 supers podían pasar ambos y dejar el sistema
  sin super-admin. **Fix:** `deleteUserLogical.ts` ahora escribe primero
  (soft-delete atómico vía `findOneAndUpdate`) y **revalida después**,
  compensando (restaura) si el borrado violó el invariante — cierra la
  mayoría de la ventana de carrera (queda una ventana residual muy angosta,
  documentada en el código, si ambas revalidaciones corren antes de que
  cualquiera de las dos escrituras se propague — operacionalmente
  improbable contra el mismo primary de Mongo). `assertUserDeletable` se
  partió en `assertNotSelfDelete` (sync) + `hasOtherActiveSuperAdmin`
  (reusable) + el combinado original (que sigue usando `deleteUser`, el
  purge físico, donde el invariante es distinto — no perder el último
  registro histórico, no el conteo de activos en tiempo real). Tests en
  `assertUserDeletable.test.ts` + nuevo `deleteUserLogical.test.ts`.
- **`pnpm audit --prod`: 17 vulnerabilidades → 0.** Bumps: `i18next-fs-backend`
  ^2.6.6 (crítico, prototype pollution), `multer` ^2.2.0, `nodemailer` ^9.0.3
  (major; único breaking change de v9 es TLS estricto en fetch de contenido
  remoto — no aplica, no usamos `attachments` con URL/OAuth2/proxy),
  `file-type` ^21.3.4 (major; `fromBuffer` → renombrado `fileTypeFromBuffer`,
  mismo shape `{ext,mime}` — actualizado en `validateFileType.ts` + su test),
  `express-rate-limit` ^8.5.2 (trae `ip-address` parcheado). `pnpm.overrides`
  nuevos: `ws >=8.21.0` (mismo fix que ya tenía el frontend, nunca replicado
  acá), `undici >=6.27.0` (transitivo de `@vercel/blob`, también bumpeado a
  ^2.6.1), `form-data ^4.0.6` (transitivo de `@google-cloud/storage>
  retry-request>@types/request` — nunca importado directo, pero se fuerza
  igual), `qs ^6.15.3` (transitivo de `express`). Quedan 5 vulnerabilidades
  **solo en devDependencies** (vite/esbuild/babel vía vitest/tsx/eslint,
  vectores de "dev server en Windows") — no tocado, no llega a producción.
- **`express-rate-limit` usaba `MemoryStore`** (no distribuido): en Vercel
  serverless cada instancia concurrente tiene su propio contador, así que
  `authLimiter` (5/min) era mucho más débil de lo pensado bajo carga
  concurrente real (un atacante repartiendo requests entre instancias
  toca contadores distintos). **Fix:** `shared/infrastructure/RateLimitStore.ts`
  — `MongoRateLimitStore` (implementa el `Store` de `express-rate-limit`)
  respaldado en una colección Mongo nueva (`RateLimitHit`, TTL index en
  `resetTime`), con `increment()` atómico vía pipeline de agregación en
  `findOneAndUpdate` (decide en una sola operación de documento si reinicia
  la ventana o incrementa — sin carrera entre instancias). `globalLimiter`/
  `authLimiter` cada uno con su propio prefijo de key. Tests en
  `RateLimitStore.test.ts`.

### Verificación
`pnpm typecheck && pnpm lint` limpios. Suite completa: **318 archivos /
1148 tests**, todos en verde (sin regresiones; +6 archivos/+~30 tests nuevos
de este pase). `pnpm audit --prod`: limpio.

### No tocado (fuera de alcance de este pase, mencionado por si se retoma)
- Paginación sin límite superior en algunos endpoints de papelera que
  parsean `req.query` a mano en vez de vía Zod (ej. `client.trash.ts`:
  `Number(req.query.limit) || 20` sin `.max()`) — mismo patrón que se
  arregló en `subscriber.listAll`, pero no auditado en el resto de módulos.
- Orden de middlewares en `config/app.ts`: `globalLimiter` corre *después*
  de JSON/urlencoded parsing, CORS y compression — gastar menos CPU en
  tráfico que de todos modos se va a rechazar sería mover el limiter antes,
  pero es una optimización menor, no una brecha.
- 5 vulnerabilidades de `pnpm audit` en devDependencies (vite/esbuild/babel) —
  no llegan a producción, bump requeriría revisar breaking changes de vitest.

## Apéndice — mapa rápido de archivos clave
- Permisos: `src/constants/permissions.ts`
- Auth (casos de uso): `src/modules/auth/application/*`
- Rate limit: `src/config/limiter.ts` (authLimiter sin usar)
- Storage driver factory: `src/modules/storage/infrastructure/StorageService.ts`
- Subida: `src/modules/storage/application/uploadFile.ts`
- app-settings (singleton): `src/modules/app-settings/*`
- Modelos: `*/infrastructure/<Entidad>Model.ts`
- Auditoría: `src/modules/audit-log/middlewares/captureAudit.ts`
- EventBus (sin uso): `src/shared/infrastructure/EventBus.ts`
- Seed (con credenciales): `scripts/seed-super-admin.js`
</content>
</invoke>
