# First Backend - Configuración Vercel con Path Aliases

## 🎯 Problema Resuelto: Path Aliases en Vercel

### ¿Por qué fallaban los path aliases?

Antes:
```json
// vercel.json (❌ INCORRECTO)
{
  "builds": [{ "src": "src/index.ts", "use": "@vercel/node" }]
}
```

**Problema:** Vercel intentaba ejecutar TypeScript directamente, pero:
- TypeScript no resuelve path aliases en runtime
- Los imports `@Constants/*` solo existen en desarrollo

### ✅ Solución Implementada

Ahora Vercel usa el código **compilado** donde `tsc-alias` ya resolvió todos los path aliases:

```json
// vercel.json (✅ CORRECTO)
{
  "builds": [{ "src": "dist/index.js", "use": "@vercel/node" }]
}
```

**Flujo de deployment:**
```
1. git push
2. Vercel ejecuta: pnpm run vercel-build
3. Compila: tsc (TypeScript → JavaScript)
4. Resuelve aliases: tsc-alias (@Constants → ./constants)
5. Resultado: dist/index.js con imports reales
6. Vercel ejecuta: dist/index.js ✓
```

## 🚀 Cómo Funciona

### Path Aliases Configurados

En [tsconfig.json](tsconfig.json):
```json
{
  "paths": {
    "@Constants/*": ["src/constants/*"],
    "@Config/*": ["src/config/*"],
    "@Connection/*": ["src/connection/*"],
    "@Routers/*": ["src/routers/*"]
  }
}
```

### Ejemplo de Conversión

**Código fuente (TypeScript):**
```typescript
import { PORT } from '@Constants/environments';
```

**Código compilado (JavaScript):**
```javascript
const environments_1 = require("./constants/environments");
```

`tsc-alias` convierte automáticamente los path aliases a rutas relativas.

## 📦 Scripts de Build

```json
{
  "scripts": {
    "dev": "nodemon",                    // Desarrollo local
    "build": "tsc && tsc-alias",         // Build manual
    "vercel-build": "tsc && tsc-alias"   // Build automático en Vercel
  }
}
```

## 🔧 Configuración de Vercel

### 1. Variables de Entorno

En el dashboard de Vercel, configura:

```bash
# Opción 1: Con prefijo FIRST_
FIRST_PORT=3000
FIRST_MONGODB_URI=mongodb+srv://...
FIRST_SECRET_KEY=your-secret
FIRST_URL_ORIGINS=https://your-app.vercel.app
FIRST_JWT_EXPIRES_IN=7d
FIRST_ENVIRONMENT=production

# Opción 2: Sin prefijo (fallback)
PORT=3000
MONGO_URI=mongodb+srv://...
NODE_ENV=production
```

El código acepta ambos formatos (ver [src/constants/environments.ts](src/constants/environments.ts)).

### 2. Deploy

```bash
# Opción A: Push automático
git add .
git commit -m "fix: configuración Vercel con path aliases"
git push

# Opción B: CLI de Vercel
vercel --prod
```

## 🧪 Testing Local

### 1. Test con nodemon (desarrollo):
```bash
pnpm dev
# Usa: node --env-file=.env con ts-node
# Path aliases funcionan via tsconfig-paths
```

### 2. Test del build (simulando Vercel):
```bash
# Compilar
pnpm run build

# Verificar path aliases resueltos
cat dist/index.js | grep "require"
# Deberías ver: require("./constants/environments")
# NO deberías ver: @Constants

# Ejecutar el build
node --env-file=.env dist/index.js
```

## 📁 Estructura del Proyecto

```
first-backend/
├── src/                    # Código fuente TypeScript
│   ├── index.ts           # Entry point
│   ├── constants/
│   │   └── environments.ts
│   ├── config/
│   ├── connection/
│   └── routers/
├── dist/                   # Código compilado (generado)
│   ├── index.js           # Entry point compilado
│   └── constants/
│       └── environments.js
├── tsconfig.json          # Path aliases definidos
├── vercel.json            # Apunta a dist/index.js
└── .vercelignore          # Ignora src/ en deploy
```

## ⚠️ Notas Importantes

### 1. Node.js Nativo para .env (v20.6+)

Ya no necesitas el paquete `dotenv`. Node v25.6 soporta `.env` nativamente:

```bash
# En nodemon.json
node --env-file=.env ...
```

Puedes desinstalar dotenv si quieres:
```bash
pnpm remove dotenv
```

### 2. Vercel NO sube archivos en .vercelignore

Archivos ignorados:
- `src/` (código fuente)
- `node_modules/`
- `.env`
- Archivos de configuración de desarrollo

Solo se despliega: `dist/` + `package.json` + `vercel.json`

### 3. Build Automático

Vercel detecta automáticamente:
- `vercel-build` script → Lo ejecuta antes de deploy
- `dist/index.js` → Entry point desde vercel.json

## 🐛 Troubleshooting

### Error: "Cannot find module '@Constants/...'"

**Causa:** Path aliases no resueltos en el código compilado.

**Solución:**
```bash
# 1. Verificar que tsc-alias está instalado
pnpm list tsc-alias

# 2. Rebuild
rm -rf dist
pnpm run build

# 3. Verificar conversión
cat dist/index.js | grep "@Constants"
# Resultado esperado: (sin output, no debe existir)
```

### Error: "Module not found: './common'"

**Causa:** Import relativo incorrecto o carpeta faltante.

**Solución:** Usa path aliases consistentemente:
```typescript
// ✅ BIEN
import { PORT } from '@Constants/environments';

// ❌ MAL (si la estructura de carpetas no coincide)
import { PORT } from './common';
```

## 📚 Recursos

- [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [tsc-alias](https://github.com/justkey007/tsc-alias)
- [Node.js --env-file](https://nodejs.org/dist/latest-v20.x/docs/api/cli.html#--env-fileconfig)

## ✅ Checklist Pre-Deploy

- [ ] `pnpm run build` exitoso
- [ ] `dist/index.js` existe
- [ ] No hay referencias `@Constants` en `dist/` (usar grep)
- [ ] Variables de entorno configuradas en Vercel
- [ ] `.vercelignore` excluye `src/` y `node_modules/`
- [ ] `vercel.json` apunta a `dist/index.js`
- [ ] Push a GitHub → Vercel auto-deploys
