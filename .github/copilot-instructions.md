# Copilot instructions (first-backend)

## Big picture

This is a minimal Express.js + TypeScript backend deployed as a Vercel serverless function.

- **Entry point:** `src/index.ts` - Simple Express app with 2 basic routes (/ and /api/health)
- **Environment config:** `src/constants/environments.ts` - Exports all environment variables
- **Development:** Uses nodemon with Node.js native `.env` support (v25.6+)
- **Production:** Compiled to `dist/` and wrapped by `api/index.js` for Vercel serverless

## Current structure

```
src/
├── index.ts                    # Main Express app (exports default)
└── constants/
    └── environments.ts         # Environment variables

dist/                           # Build output (generated, gitignored)
api/index.js                    # Vercel serverless wrapper
```

### Planned expansions (dependencies installed, not yet implemented):

- MongoDB/Mongoose connection
- Modular routing system (auth, users, etc.)
- Zod validation schemas
- Middleware: helmet, rate limiting, CORS, compression

## TypeScript + imports

- Path aliases configured in `tsconfig.json`:
  - `@Constants/*` → `src/constants/*` (currently used)
  - `@Config/*` → `src/config/*` (prepared for future)
  - `@Modules/*` → `src/modules/*` (prepared for future)
  - `@Helpers/*` → `src/libs/helpers/*` (prepared for future)
- `tsc-alias` resolves these to relative paths during build

## Environment variables

Expected in `.env` (all optional with fallbacks):

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb+srv://...
MONGO_DATABASE=your-db
MONGO_APP_NAME=first-backend
SECRET_KEY=your-secret
WHITELISTED_DOMAINS=http://localhost:3000
JWT_EXPIRES_IN=7d
```

## Local dev commands

- `pnpm dev` - Runs nodemon with ts-node and tsconfig-paths, watches `src/`
- `pnpm run build` - Compiles TypeScript and resolves path aliases to `dist/`
- `node --env-file=.env dist/index.js` - Test production build locally

## Vercel deployment (serverless functions)

- **Entry point:** `api/index.js` wraps and re-exports `dist/index.js` (the compiled Express app)
- **Build:** `vercel.json` runs `pnpm run build` which executes `tsc && tsc-alias`
- **Path aliases:** `tsc-alias` resolves all `@Constants/*`, etc. to relative paths in `dist/` at build time. Vercel never sees the TypeScript source or path aliases
- **Routing:** `vercel.json` rewrites all requests `/(.*) → /api/index` so every route hits the Express app
- **Environment variables:** Must be set in Vercel dashboard (not read from `.env` in production)
- **Testing production build locally:** `pnpm run build && node --env-file=.env dist/index.js`

### Important Vercel behavior:

- `src/index.ts` checks `require.main === module` to conditionally listen on PORT (for local dev only)
- In Vercel, the app is imported (not executed directly), so `app.listen()` never runs
- Vercel wraps the exported Express app in its serverless handler automatically

Do not modify `api/index.js` or `vercel.json` without understanding the serverless wrapper pattern.
