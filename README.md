# First Backend

REST API built with **Node.js + TypeScript + Express + MongoDB**, deployed on Vercel as a serverless function.

## Quick Start

```bash
# Install dependencies
pnpm install

# Development (with hot reload)
pnpm dev

# Build
pnpm run build
```

## Quality Gates

Run all of these — and have them pass — before opening a PR. There is no
CI pipeline yet (see "Known Gaps" below), so this is enforced by convention,
not by a bot.

```bash
pnpm typecheck     # tsc --noEmit
pnpm lint          # ESLint + TypeScript-ESLint + SonarJS (merged into one config, one command)
pnpm format:check  # Prettier — fails if any file isn't formatted (pnpm format to fix)
pnpm test          # Vitest + coverage; fails if coverage drops below the floor below
pnpm audit --prod  # Dependency vulnerabilities in production deps (see caveat below)
```

- **Lint already includes SonarJS** (`eslint-plugin-sonarjs`) — unlike some
  sibling projects, there's no separate `lint:sonar` command here; `pnpm lint`
  is the single source of truth and must report 0 problems.
- **Coverage floor, not a target.** `vitest.config.ts` sets
  `coverage.thresholds` a few points below the actual current numbers
  (statements 70 / branches 65 / functions 55 / lines 70) so `pnpm test`
  fails on a real regression. The repo is **not** at 100% coverage today —
  many bulk/trash endpoints are thin delegation wrappers with little
  branching logic and aren't individually covered. Aim for full coverage of
  new business logic (schemas, use-cases, anything with branches), not of
  every thin wrapper.
- **`pnpm audit`** (no `--prod`) also checks devDependencies. Keep both at 0
  known vulnerabilities — devDependency findings still matter (supply-chain
  risk in the toolchain), just lower urgency than a production dependency.
- **Line endings are LF** (`.gitattributes` → `eol=lf`). On Windows, if
  `core.autocrlf=true` leaves working-tree files with CRLF despite that
  (git won't always re-checkout files it considers "unchanged" after
  normalization), `pnpm format:check` will report spurious failures. Fix:
  `git rm --cached -r . && git reset --hard` (safe only with a clean working
  tree — stash any real changes first).

### Known Gaps

- **No CI/CD.** Nothing automatically blocks a PR with failing gates, or a
  newly-vulnerable dependency, before merge to `main` (which auto-deploys to
  Production on Vercel). Today this is caught manually / by whoever reviews.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
# Server
NODE_ENV=development
PORT=3200

# MongoDB
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGO_DATABASE=first-backend
MONGO_APP_NAME=first-backend

# JWT secrets (change all in production)
JWT_ACCESS_SECRET=dev_access_secret_change_in_production
JWT_REFRESH_SECRET=dev_refresh_secret_change_in_production
JWT_EMAIL_SECRET=dev_email_secret_change_in_production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
JWT_EMAIL_EXPIRES=24h
JWT_RESET_EXPIRES=1h

# CORS
WHITELISTED_DOMAINS=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Email — optional, uses Ethereal auto-account in development
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=noreply@first-backend.com

# Storage
STORAGE_DRIVER=vercel-blob          # vercel-blob | s3 | gcs | azure-blob
BLOB_READ_WRITE_TOKEN=              # required for vercel-blob driver
STORAGE_MAX_FILE_SIZE_BYTES=10485760
STORAGE_MAX_FILES_BULK=10

# DNS (public resolvers as fallback for MongoDB Atlas SRV)
DNS_SERVERS=8.8.8.8,1.1.1.1
```

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 24 |
| Framework | Express 5 |
| Language | TypeScript 6 |
| Database | MongoDB via Mongoose 9 |
| Validation | Zod 4 |
| Auth | JWT (access + refresh + email tokens) |
| Email | Nodemailer (Ethereal in dev, SMTP in prod) |
| Storage | Vercel Blob / S3 / GCS / Azure Blob |
| Realtime | Socket.io 4 |
| Testing | Vitest + Istanbul (coverage floor enforced, see Quality Gates) |
| Lint | ESLint 10 + TypeScript ESLint + SonarJS |
| Deployment | Vercel (serverless) |

## Project Structure

```text
src/
├── config/               # Express app setup, i18n, DB connection
├── constants/            # Environment variables (Zod-validated), permissions catalog
├── helpers/              # Shared utilities (JWT, logging, UUID, response helpers)
├── locales/              # Global i18n error keys (10 languages)
├── middlewares/          # Auth guard, RBAC permission check, rate limiter
├── modules/
│   ├── auth/             # Login, refresh, logout, verify-email, forgot/reset password
│   ├── users/            # User CRUD + profile endpoints
│   ├── user-groups/      # RBAC groups management
│   ├── subscribers/      # Newsletter subscriber list
│   ├── storage/          # File upload (single/bulk) and delete via cloud drivers
│   ├── audit-log/        # Immutable audit trail, filterable by user/action/resource/date
│   ├── app-settings/     # Global app configuration with in-memory cache (5 min TTL)
│   ├── clients/          # CRM — client management (private, admin-only)
│   ├── services/         # navike21 service catalog with multilingual content
│   ├── portfolio/        # Project showcase linking clients and services
│   ├── notifications-email/  # Transactional email templates
│   ├── health/           # Health check endpoint
│   └── welcomeApi/       # Root welcome endpoint
├── routes/               # Central router (mounts all module routes)
├── shared/               # Socket.io server setup
├── index.ts              # Vercel entry point (app + DB exported separately)
└── server.ts             # Local dev entry point (binds port, Socket.io)

api/
└── index.js              # Vercel serverless handler

dist/                     # Compiled output (generated by build)
docs/
└── insomnia.collection.json  # Importable Insomnia collection
```

## Modules

### Auth
JWT authentication with triple-secret model. Refresh token rotation with reuse detection (all sessions revoked on replay attack).

Routes: `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/verify-email/:token`, `/auth/forgot-password`, `/auth/reset-password/:token`, `/auth/change-password`, `GET /auth/sessions`

### Users
Full CRUD for admin routes (`/users`) plus self-service profile endpoints (`/users/me`).

### User Groups (RBAC)
Groups define the permission set for each user. System groups are protected from modification. Includes a permissions catalog endpoint at `GET /permissions/catalog`.

### Subscribers
Newsletter subscriber list with soft and hard delete, bulk operations, and public registration form.

### Storage
Cloud file storage with a driver abstraction layer. Supports single upload, bulk upload (up to 10 files), and delete by URL. MIME type validation and optional image compression via `sharp`.

Permissions: `storage:upload`, `storage:delete`, `storage:manage`

### Audit Log
Append-only audit trail automatically populated by the `captureAudit` middleware. Supports filtering by `userId`, `action`, `resource`, and date range.

Permissions: `audit-logs:read`, `audit-logs:manage`

### App Settings
Global application configuration stored in MongoDB, served from an in-memory cache with a 5-minute TTL. Three categories: `general`, `notifications`, `appearance`. Falls back to hardcoded defaults when no document exists.

Permissions: `app-settings:read`, `app-settings:update`, `app-settings:manage`

### Clients
CRM-style client management. All routes require authentication — client data is private. Only `businessName`, `logoUrl`, and `website` are exposed in public portfolio context. Supports international document types (DNI, RUC, NIF, CNPJ, EIN, VAT, etc.) and ISO alpha-2 country codes. Soft delete preserves history.

Routes: `POST /clients`, `GET /clients`, `GET /clients/:id`, `PATCH /clients/:id`, `DELETE /clients/:id`

Permissions: `clients:read`, `clients:create`, `clients:update`, `clients:delete`, `clients:manage`

### Services
Manages navike21's 8 official services (Desarrollo web, Ecommerce, Software a medida, Mobile, Marketing Digital, SEO, Diseño UX/UI, Email marketing) with full multilingual content in 10 languages. Public GET endpoints; write endpoints require auth. Slugs are auto-generated from `name.en` using Unicode transliteration (CJK → romaji/pinyin, Cyrillic → Latin, accents stripped).

Public routes: `GET /services`, `GET /services/:slug`

Admin routes: `GET /services/admin`, `POST /services`, `PATCH /services/:slug`, `DELETE /services/:slug`

Permissions: `services:read`, `services:create`, `services:update`, `services:delete`, `services:manage`

### Portfolio
Project showcase with multilingual content. Links clients and services via application-level UUID joins. Public detail responses embed client name + logo and service metadata. Supports testimonials, metrics, and gallery. Featured projects are sorted first.

Public routes: `GET /portfolio`, `GET /portfolio/by-service/:serviceSlug`, `GET /portfolio/:slug`

Admin routes: `GET /portfolio/admin`, `POST /portfolio`, `PATCH /portfolio/:id`, `DELETE /portfolio/:id`

Permissions: `portfolio:read`, `portfolio:create`, `portfolio:update`, `portfolio:delete`, `portfolio:manage`

## RBAC Permissions

| Module | Permissions |
|---|---|
| Profile | `profile:read`, `profile:update` |
| Users | `users:read`, `users:create`, `users:update`, `users:delete`, `users:manage` |
| User Groups | `user-groups:read`, `user-groups:create`, `user-groups:update`, `user-groups:delete`, `user-groups:manage` |
| Subscribers | `subscribers:read`, `subscribers:create`, `subscribers:update`, `subscribers:delete`, `subscribers:manage` |
| Storage | `storage:upload`, `storage:delete`, `storage:manage` |
| Audit Logs | `audit-logs:read`, `audit-logs:manage` |
| App Settings | `app-settings:read`, `app-settings:update`, `app-settings:manage` |
| Clients | `clients:read`, `clients:create`, `clients:update`, `clients:delete`, `clients:manage` |
| Services | `services:read`, `services:create`, `services:update`, `services:delete`, `services:manage` |
| Portfolio | `portfolio:read`, `portfolio:create`, `portfolio:update`, `portfolio:delete`, `portfolio:manage` |
| Superadmin | `*:*` |

`*:manage` is a wildcard that covers all non-`manage` actions for the same module.

## API Documentation

Import `docs/insomnia.collection.json` into [Insomnia](https://insomnia.rest) to get a ready-to-use collection with:
- Three pre-configured environments (Base, Development, Production)
- Environment variables: `access_token`, `user_id`, `group_id`, `subscriber_id`, `audit_log_id`, `client_id`, `service_slug`, `portfolio_slug`, `portfolio_id`
- Documented request bodies and response examples for all endpoints

## Internationalization

All routes accept `Accept-Language` for localized responses and emails.

Supported languages: `es` `en` `de` `fr` `it` `ja` `ko` `pt` `ru` `zh`

## Testing

```bash
pnpm test
```

See [Quality Gates](#quality-gates) for the coverage floor and what's actually enforced.

## Deployment

The project deploys to Vercel using a serverless function at `api/index.js`. The app setup (`initApp`) is separated from the database connection (`ensureConnected`) so the function returns a proper HTTP response even during cold starts with a slow DB connection.

```bash
# Build and verify locally before deploying
pnpm run build && node --env-file=.env dist/server.js
```

## License

Apache-2.0
