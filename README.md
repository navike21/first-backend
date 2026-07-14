# First Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-24%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-via%20Mongoose%209-47A248?logo=mongodb&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)
![Tests](https://img.shields.io/badge/tests-1159%20passing-brightgreen)
![License](https://img.shields.io/badge/license-Apache--2.0-blue)

</div>

REST API for **First** — a multi-purpose CRM + CMS platform (client/project
management, a visual page builder, service/portfolio catalog, and public
website delivery). Built with **Node.js + TypeScript + Express + MongoDB**,
deployed on Vercel as a serverless function; powers
[`first-frontend`](../first-frontend).

**20** business modules · **138** documented endpoints ([Swagger UI](#api-documentation))
· **10** languages · RBAC (`resource:action` permissions) · backend-driven
file uploads (4 swappable storage drivers) · MongoDB-backed rate limiting
(correct under concurrent serverless instances).

> **New to this repo?** Read [`CLAUDE.md`](./CLAUDE.md) first — it documents
> the conventions (RBAC, soft/hard delete, file uploads, i18n, bulk ops) that
> every module follows. This README covers *what exists*; `CLAUDE.md` covers
> *how to build more of it consistently*.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Modules](#modules)
- [RBAC — Permissions](#rbac--permissions)
- [Security](#security)
- [File Uploads](#file-uploads)
- [Performance](#performance)
- [Internationalization](#internationalization)
- [Quality Gates](#quality-gates)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [License](#license)

## Quick Start

```bash
# Install dependencies
pnpm install

# Development (nodemon, hot reload)
pnpm dev

# Build (tsc + tsc-alias)
pnpm build

# Build and run the compiled output locally — closest to what Vercel runs
pnpm build && node --env-file=.env dist/server.js
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. `MONGO_URI` and
`MONGO_DATABASE` are the only two required at boot — everything else has a
safe default for local development, and the app **refuses to boot** if a JWT
secret is left at its insecure default while `NODE_ENV=production`.

<details>
<summary><strong>Full variable reference</strong></summary>

| Variable | Default | Notes |
|---|---|---|
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `PORT` | `3200` | Local dev server port |
| `MONGO_URI` | — | **Required** |
| `MONGO_DATABASE` | — | **Required** |
| `MONGO_APP_NAME` | `''` | Shown in Atlas connection metrics |
| `WHITELISTED_DOMAINS` | `''` (deny-all) | Comma-separated CORS allowlist — **fails closed** if empty |
| `CLIENT_URL` | `http://localhost:3000` | Used in email links |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` / `JWT_EMAIL_SECRET` | dev placeholders | Must be changed in production (boot-time check) |
| `JWT_ACCESS_EXPIRES` | `8h` | |
| `JWT_REFRESH_EXPIRES` | `30d` | |
| `JWT_EMAIL_EXPIRES` | `24h` | |
| `JWT_RESET_EXPIRES` | `1h` | |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS` | — | Optional — an [Ethereal](https://ethereal.email) test account is auto-created in dev when unset |
| `EMAIL_FROM` | `noreply@first-backend.com` | |
| `DNS_SERVERS` | `8.8.8.8,1.1.1.1` | Fallback resolvers for Atlas SRV lookups on some networks |
| `STORAGE_DRIVER` | `vercel-blob` | `vercel-blob` \| `s3` \| `gcs` \| `azure-blob` |
| `STORAGE_MAX_FILE_SIZE_BYTES` | `10485760` (10 MB) | Generic upload cap |
| `STORAGE_MAX_IMAGE_SIZE_BYTES` | `4194304` (4 MB) | Lower cap — images are proxied through the serverless function body |
| `STORAGE_MAX_VIDEO_SIZE_BYTES` | `52428800` (50 MB) | Not proxied — direct browser-to-storage upload |
| `STORAGE_MAX_FILES_BULK` | `10` | 1–20 |
| `BLOB_READ_WRITE_TOKEN` | — | Required for the `vercel-blob` driver |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` / `AWS_REGION` / `AWS_S3_BUCKET` | — | Required for the `s3` driver |
| `GCS_BUCKET` / `GCS_CREDENTIALS` | — | Required for the `gcs` driver (base64-encoded service-account JSON) |
| `AZURE_STORAGE_CONNECTION_STRING` / `AZURE_STORAGE_CONTAINER` | — | Required for the `azure-blob` driver |
| `API_DOCS_USER` / `API_DOCS_PASSWORD` | — | Optional — set **both** to gate `/api/v1/docs` behind HTTP Basic Auth; unset (default) keeps the docs public |

</details>

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 24 |
| Framework | Express 5 |
| Language | TypeScript 6 |
| Database | MongoDB via Mongoose 9 (Stable API v1, `strict: true`) |
| Validation | Zod 4 |
| Auth | JWT — separate access/refresh/email secrets, refresh-token rotation with reuse detection |
| Rate limiting | `express-rate-limit`, backed by a custom **MongoDB store** (not in-memory — stays correct across concurrent serverless instances) |
| Email | Nodemailer (Ethereal in dev, SMTP in prod), dispatched asynchronously via an in-process `EventBus` |
| Storage | Vercel Blob / S3 / GCS / Azure Blob — one driver interface, swappable via `STORAGE_DRIVER` |
| Image processing | `sharp` — generates `full` (≤2000px) + `thumb` (700px) WebP variants |
| Realtime | Socket.io — presence |
| Sanitization | `sanitize-html` on every stored rich-text field |
| Testing | Vitest + Istanbul coverage, `mongodb-memory-server` for integration tests |
| Lint | ESLint 10 + `typescript-eslint` + SonarJS (one merged config) |
| Deployment | Vercel (serverless function) |

## Architecture

DDD-flavored modular monolith. Each module is self-contained and exports a
single Express sub-router; nothing outside `src/modules/<name>/index.ts` is
imported by other modules.

```text
src/
├── config/          Express app setup (helmet/CORS/compression/i18n), Mongo connection options
├── connection/       connectToDatabase() — idempotent, serverless-safe (readyState guard, small pool)
├── constants/        environments (Zod-validated), permissions catalog, system enums
├── helpers/          Pure utilities: validate(), responseStructure, escapeHtml, escapeRegex,
│                     sanitizeHtml, JWT-adjacent helpers, log, uuid, bulkOutcome
├── middlewares/       asyncHandler, errorMiddleware (maps AppError + Mongo E11000 → HTTP), i18nMiddleware
├── modules/           20 business modules (see below)
├── shared/
│   ├── domain/           AppError (typed, i18n-keyed errors)
│   ├── events/           Domain events (email side-effects)
│   ├── infrastructure/   EventBus, JwtService, SocketServer, RateLimitStore (Mongo-backed)
│   ├── schemas/          Cross-module Zod schemas (LocalizedString / LocalizedHtmlString, bulkIds)
│   └── types/            Shared TS types
├── routes/           Central router — mounts every module under /api/v1
└── server.ts         Local dev entrypoint (binds a port, boots Socket.io)

api/
└── index.js          Vercel serverless handler — separates app setup from DB connection so a
                       cold start with a slow DB still returns a proper HTTP response, not a timeout
```

Inside a module:

```text
modules/<name>/
├── application/      Use-cases — pure business logic, no HTTP/Express types
├── controllers/      Thin HTTP handlers — parse, call a use-case, respond
├── domain/errors/     Typed errors specific to this module
├── infrastructure/    Mongoose model(s)
├── routes/           Express router for this module
├── schemas/          Zod input/output validation
├── constants/        Module-local enums, paths
├── locales/          messages.json × 10 languages (module-specific i18n keys)
└── index.ts          Public API — the ONLY file other modules may import from
```

## Modules

| Module | Purpose |
|---|---|
| `auth` | Login, refresh (httpOnly-cookie rotation with reuse detection), logout, email verification, forgot/reset/change password, active sessions |
| `users` | Admin user CRUD + self-service profile (`/users/me`), presence |
| `user-groups` | RBAC groups — the permission set a user inherits; group membership is many-to-many |
| `clients` | CRM — private client records (international document types, ISO country codes) |
| `services` | Public service catalog, full multilingual content, slug auto-generated via transliteration |
| `portfolio` | Project showcase linking clients + services, testimonials, gallery, metrics |
| `pages` | Generic CMS pages with a **visual, section → column → widget builder** (10 widget types), revisions, hierarchical parent/child |
| `collaborators` | Public-facing team profiles (distinct from `users` — see note below) |
| `subscribers` | Newsletter list, public registration |
| `categories` / `tags` | Shared taxonomy for content (portfolio, services, pages) |
| `forms` | Admin-defined public forms (8 field types: text/textarea/email/phone/select/radio/checkbox/date) + submissions inbox, email-notified per form |
| `storage` | Cloud file storage abstraction (4 drivers), single/bulk upload, MIME validation by magic bytes, image variants |
| `site-config` | Global site-wide presentation settings (header/footer/social/maps provider) — distinct from `app-settings` |
| `app-settings` | Organization-level config singleton (branding, notifications, appearance) |
| `audit-log` | Append-only trail, auto-populated by middleware, filterable by user/action/resource/date; also records every 403 |
| `notifications-email` | Transactional templates, dispatched asynchronously via the `EventBus` |
| `config` | Read-only reference data: currencies, document types, languages, industries, client types, genders, collaborator roles/levels, technologies |
| `geo` | Read-only reference data: countries + Peru ubigeo, cascading region → province → district |
| `health` | `GET /health` — 200 + `db:connected`, or 503 |
| `welcomeApi` | Root welcome endpoint |

> **`users` vs `collaborators`**: not the same thing, on purpose. A `user` is
> an identity with backend access (login, group membership, permissions). A
> `collaborator` is a public CMS entity (a team member shown on the website).
> A collaborator can optionally link to a user via `userId` without merging
> the two concepts.

<details>
<summary><strong><code>pages</code> — the 10 widget types the builder validates</strong></summary>

Each section holds columns of widgets; `content` is a loosely-typed JSON blob
per widget (interpreted by the frontend), but the two rich-text fields are
still sanitized server-side before persisting — the admin editor is not
trusted as the only line of defense.

| Widget | Backend-relevant contract |
|---|---|
| Text | `html` (localized) — sanitized via `sanitize-html` |
| Image | Storage reference + width/height/alignment |
| Slider | Ordered list of image/video storage references |
| Button | Localized label + link (page id or URL) + variant |
| Gallery | Grid of storage references + localized alt text per image |
| Accordion | Question/answer pairs — `answer` (localized) sanitized via `sanitize-html` |
| Testimonials | Name, role, quote, photo reference, rating (1–5) |
| Stats | Value ("500+", "98%") + label — plain text, not HTML |
| Video | Embed URL + caption |
| Map | Address + lat/lng (validated as numbers) + CTA link |

</details>

<details>
<summary><strong><code>forms</code> — dynamic validation, a first for this codebase</strong></summary>

Every other module validates a hand-written, static Zod schema. A form's
fields are admin-authored **data**, not code, so the submission schema is
built at request time from the target form's own field list
(`buildSubmissionSchema`, in `schemas/`): one Zod rule per field type
(`z.email()`, `z.boolean()`, `z.enum(options)`, …), keyed by each field's
server-assigned `fieldId` (never by label — labels are localized and
mutable), with `.strict()` rejecting any key that isn't a real field on
that form. Submissions live in their own collection (`FormSubmissionModel`,
tied by `formId`) — same precedent as `pages`' revisions. Soft-deleting a
form does **not** cascade to its submissions (still triageable in trash);
purging one does.

</details>

## RBAC — Permissions

`resource:action` strings, plus the `resource:manage` wildcard (grants full
CRUD but never `:purge`) and the super-root `*:*` (grants everything,
including physical destruction). A "super-admin" group can hold every
permission except `:purge` — an all-powerful admin that still cannot
permanently destroy records.

<details>
<summary><strong>Full permission catalog</strong></summary>

| Resource | Actions |
|---|---|
| `users` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `user-groups` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `subscribers` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `profile` | `read`, `update` |
| `storage` | `read`, `upload`, `update`, `delete`, `purge`, `manage` |
| `audit-logs` | `read`, `manage` |
| `app-settings` | `read`, `update`, `manage` |
| `site-config` | `read`, `update`, `manage` |
| `clients` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `services` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `portfolio` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `pages` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `collaborators` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `categories` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `tags` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `forms` | `read`, `create`, `update`, `delete`, `purge`, `manage` |
| `forms-submissions` | `read`, `delete`, `purge`, `manage` — deliberately separate from `forms`: a support/sales role can triage submissions without being able to redefine the form itself |
| Super-root | `*:*` |

`config` and `geo` are public, read-only reference endpoints — no permission
required.

</details>

## Security

- **JWT with a triple-secret model** (access/refresh/email are signed
  independently) + refresh-token rotation with **reuse detection** (a replayed
  refresh token revokes every session).
- **CORS fails closed**: an unset/misconfigured `WHITELISTED_DOMAINS` denies
  all cross-origin requests rather than reflecting any origin.
- **Rate limiting backed by MongoDB**, not in-memory — correct under Vercel's
  concurrent serverless instances (an in-memory store would let an attacker
  bypass the login rate limit by spreading requests across instances).
- **Stored-content sanitization**: every rich-text field (service/portfolio
  descriptions, collaborator bios, page-builder text/accordion widgets) is
  passed through `sanitize-html` server-side before it's persisted — the
  admin-panel's rich-text editor is not trusted as the only line of defense.
- **Helmet** (CSP, HSTS, frameguard, referrer policy) + `compression` +
  request body caps.
- **Purge (physical deletion) always requires an explicit `:purge`
  permission** — `:manage` deliberately does not grant it.
- **`assertUserDeletable`** blocks self-deletion and deleting the last active
  super-admin (with a write-then-verify-and-compensate pattern that closes
  the race window between two concurrent deletes).
- **Audit log** captures every non-2xx response (not just successful
  actions), plus every 403 specifically.
- File uploads are validated by **magic bytes** (`file-type`), not just the
  declared MIME type.
- `pnpm audit` — **0 known vulnerabilities** (production and dev dependencies).

## File Uploads

A single request, backend-driven. The frontend never talks to storage
directly for standard uploads (large video is the one exception — below).

1. `multipart/form-data`: one part named `data` (JSON body) + one file part
   (`logo`, `avatar`, `photo`, `cover`, …, depending on the module).
2. The controller parses `data`, validates it with the module's Zod schema,
   and validates the file's real content type via magic bytes.
3. The use-case uploads the file (never throws — a failed upload degrades to
   a `warnings[]` entry in the response, not a failed request) and persists
   the record.
4. On **update**, the old file is deleted after the new one is confirmed
   stored; on **purge**, every variant (original/full/thumb) is deleted.

Large video (page-builder slider/gallery, testimonial avatars) bypasses the
~4.5 MB serverless body limit via a **direct browser-to-storage upload**: the
backend issues a short-lived token, the browser uploads straight to the
storage driver, and a lightweight `POST /storage/:id/cover` call attaches a
client-captured video frame as the cover image (no `ffmpeg` on the server).

Full contract: [`docs/API-UPLOADS.md`](./docs/API-UPLOADS.md).

## Performance

- **Cold-start-safe serverless handler**: `api/index.js` separates app setup
  (`initApp` — sync, no DB) from `ensureConnected` (idempotent, retried
  per-request) — a slow/failing DB never turns into a function timeout, and
  warm invocations skip setup entirely.
- **Connection reuse**: `connectToDatabase()` guards on Mongoose's
  `readyState` and keeps a small pool, so warm serverless instances reuse the
  existing connection instead of reconnecting per request.
- **Response compression** (`compression`, threshold 1 KB) on every response.
- **Image variants**: `sharp` generates a `thumb` (700px) and `full` (≤2000px)
  WebP alongside the original — list views and public pages fetch the small
  variant instead of the original upload.
- **Large video bypasses the function body entirely** (direct
  browser-to-storage upload, see [File Uploads](#file-uploads) above) —
  the ~4.5 MB serverless body limit never applies to it.
- Known gap: no response caching / CDN cache-control tuning yet for public,
  cacheable GETs (services/portfolio/pages) — tracked, not silently ignored.

## Internationalization

10 languages: `es` `en` `de` `fr` `it` `ja` `ko` `pt` `ru` `zh`. Every request
honors `Accept-Language` for both API error messages and transactional
emails. Global error keys live in `src/locales/<lang>/errors.json`; each
module has its own `modules/<name>/locales/<lang>/messages.json`.

## Quality Gates

Run all of these — and have them pass — before opening a PR. There is no
CI pipeline yet (tracked as a known gap, not silently ignored), so this is
enforced by convention.

```bash
pnpm typecheck     # tsc --noEmit
pnpm lint          # ESLint + TypeScript-ESLint + SonarJS — one command, 0 problems
pnpm format:check  # Prettier — pnpm format to fix
pnpm test          # Vitest + coverage; fails if coverage drops below the floor
pnpm audit --prod  # Production-dependency vulnerabilities
```

- **Coverage floor, not a target.** `vitest.config.ts` sets a threshold a few
  points below the current actuals (statements 70 / branches 65 / functions 55
  / lines 70) so `pnpm test` fails on a real regression, without pretending
  the repo is at 100% today — many bulk/trash endpoints are thin delegation
  wrappers with little branching logic.
- **`pnpm audit`** (no `--prod`) also checks devDependencies — keep both at 0.
- Line endings are LF (`.gitattributes`). On Windows, if `core.autocrlf=true`
  leaves working-tree files with CRLF, `pnpm format:check` reports spurious
  failures — fix with `git rm --cached -r . && git reset --hard` (stash any
  real changes first).

## Testing

```bash
pnpm test
```

**1159 tests** across 320 files. Unit tests mock the model/dependencies;
integration tests use `mongodb-memory-server` (a real, in-memory MongoDB) via
the `withMongo()` helper.

## Deployment

Vercel, serverless. `main` → Production; `feature/*` → Preview. The
serverless handler (`api/index.js`) separates **app setup** (`initApp` — sync,
never touches the DB) from **DB connection** (`ensureConnected` — idempotent,
retried per-request), so a cold start with a slow/failing DB connection still
returns a proper `503` instead of a function timeout.

```bash
# Build and verify locally before deploying
pnpm build && node --env-file=.env dist/server.js
```

Health check: `GET /api/v1/health` → `200` + `db:connected`, or `503`.

## API Documentation

### Swagger UI (interactive, generated from source)

Visit **`/api/v1/docs`** on any running instance (local or deployed) for an
interactive Swagger UI generated straight from the app's own Zod schemas via
[`@asteasolutions/zod-to-openapi`](https://github.com/asteasolutions/zod-to-openapi) —
request bodies are the exact schemas each endpoint validates against, so the
docs can't drift out of sync with real validation. The raw OpenAPI 3.0
document is also served at `/api/v1/docs.json`.

The docs are **public by default**. To gate them behind HTTP Basic Auth
instead, set both `API_DOCS_USER` and `API_DOCS_PASSWORD` (see
[Environment Variables](#environment-variables)) and redeploy — no code
change needed. Once set, visiting `/api/v1/docs` prompts for the browser's
native username/password dialog (cached per browser session), checked with a
timing-safe comparison. Unsetting either variable makes the docs public again.

### Insomnia collection (hand-curated, request/response examples)

Import [`docs/insomnia.collection.json`](./docs/insomnia.collection.json)
into [Insomnia](https://insomnia.rest):

- Three pre-configured environments (Base, Development, Production)
- Environment variables for every entity id used across requests
- Documented request bodies and response examples for every endpoint,
  including the multipart upload contract

## License

[Apache-2.0](./LICENSE)
