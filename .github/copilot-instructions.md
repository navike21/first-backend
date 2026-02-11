# Copilot instructions (first-backend)

## Big picture
- Entry point: `src/server.ts` calls `configureApp()` then `startServer()`.
- App setup: `src/config/app.ts` configures Express middleware (CORS, JSON/body parsing, cookies, compression, helmet, rate limiting).
- Server lifecycle: `src/config/mainServer.ts` connects Mongo (`connectToDatabase()`), mounts routes (`mainRouter()`), mounts `errorMiddleware`, listens, and performs graceful shutdown on `SIGINT`/`SIGTERM`.

## How routing is structured
- Central router: `src/routes/route.ts` mounts module APIs in order: `welcomeApi`, `authApi`, `usersApi`.
- Each module exposes an `*Api(router: Router)` function from `src/modules/<module>/routes/route.ts` and is re-exported via `src/modules/<module>/index.ts`.

## Response + error conventions (important)
- Success responses MUST use `successResponse(res, { statusCode, code, message, data, meta? })` from `src/libs/helpers/responseStructure.ts`.
- Errors are typically thrown via `setThrowError({ statusCode, code, message, details? })` (`src/libs/helpers/setThrowError.ts`).
  - This throws `new Error(JSON.stringify(errorData))` and is formatted by `src/libs/middlewares/errorMiddleware.ts`.
- Some controllers (e.g. `src/modules/auth/controllers/auth.login.ts`) use `try/catch` and call `errorResponse()` directly; when adding new endpoints, prefer the `asyncHandler` + `setThrowError` pattern used throughout `users`.

## Adding a new endpoint (follow existing patterns)
1. Add a path constant in `src/modules/<module>/constants/paths.ts`.
2. (If needed) define Zod schema in `src/modules/<module>/schemas/*`.
3. Validate input using the module middleware:
   - `validateSchema(schema)` for single objects
   - `validateSchemaArray(schema)` for bulk arrays
   - `validateUpdateSchema(schema)` for PATCH semantics
4. Implement controller using `asyncHandler` (`src/libs/middlewares/asyncHandler.ts`).
5. Register the route in `src/modules/<module>/routes/route.ts`.
6. Ensure the module is mounted from `src/routes/route.ts`.

## Mongo/Mongoose conventions
- Mongo connection lives in `src/connection/dataBase.ts` and uses env vars from `src/config/environments.ts`.
- Models live in `src/modules/<module>/models/*` and use Mongoose validators via helper functions (e.g. `emailValidate`, `urlValidate`, `dateValidate`).
- API responses should strip Mongo internals using `cleanMongoFields()` and avoid returning secrets (e.g. `adminInformation.password` is sanitized in `userRegister`/`userUpdate`).

## Environment + runtime
- Env is loaded via `dotenv` in `src/config/environments.ts`.
- Expected variables: `PORT`, `NODE_ENV`, `WHITELISTED_DOMAINS` (comma-separated), `MONGO_URI`, `MONGO_DATABASE`, `MONGO_APP_NAME`.
- CORS behavior is enforced in `src/config/cors.ts` (no `Origin` allowed for Postman/curl; non-whitelisted origins are blocked and logged).
- Rate limiting is global via `globalLimiter` (`src/config/limiter.ts`); `authLimiter` exists for login-like endpoints.

## TypeScript + imports
- The repo uses TS path aliases from `tsconfig.json` (e.g. `@Config/*`, `@Modules/*`, `@Helpers/*`).
- Note: there is a constant file with a leading space in its filename: `src/libs/constants/ systemEnvironment.ts`, imported as `@Constants/ systemEnvironment` (including the space). Do not “fix” the import path unless you also rename the file and update all references.

## Local dev commands
- `pnpm dev` (nodemon + ts-node + tsconfig-paths) runs `src/server.ts`.
- Typecheck/build: `pnpm exec tsc` (outputs to `dist/` per `tsconfig.json`).
