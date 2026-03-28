# Estructura de Deployment para Vercel

Esta aplicación usa el **Vercel Serverless Functions API approach**.

## 📂 Estructura

```
first-backend/
├── src/
│   └── index.ts          # Express app (exporta default)
├── dist/                 # Compilado por TypeScript
│   └── index.js          # Express app compilado
├── api/
│   └── index.js          # Wrapper para Vercel (importa desde dist/)
└── vercel.json           # Config: rewrites hacia /api/index
```

## 🔄 Flujo de Request en Vercel

```
User Request
    ↓
  Vercel Edge
    ↓
  vercel.json (rewrites todas las rutas)
    ↓
  /api/index.js (wrapper)
    ↓
  require('../dist/index').default (Express app)
    ↓
  Express routes
    ↓
  Response
```

## ⚙️ ¿Cómo funciona?

### 1. Build Time (cuando haces push)

```bash
# Vercel detecta vercel.json y ejecuta:
pnpm run build
  ├─ tsc                  # TypeScript → JavaScript
  └─ tsc-alias            # @Constants → ./constants

# Resultado:
dist/index.js            # Express app compilado, exports.default = app
```

### 2. Runtime (cuando llega un request)

```javascript
// api/index.js actúa como entry point:
const app = require('../dist/index').default;
module.exports = app;

// Vercel automáticamente:
// 1. Detecta que es una Express app
// 2. La envuelve en un serverless function handler
// 3. Pasa req/res a Express
```

## 📝 Scripts de Desarrollo

### Local Development

```bash
# Opción 1: Con nodemon (hot reload)
pnpm dev
# Ejecuta: node --env-file=.env dist/index.js
# app.listen() SE ejecuta (require.main === module)

# Opción 2: Ejecutar build directamente
node --env-file=.env dist/index.js
```

### Testing Build

```bash
# Compilar
pnpm run build

# Verificar export
node -e "console.log(typeof require('./dist/index').default)"
# Debería imprimir: function

# Verificar wrapper de Vercel
node api/index.js
# No debería dar error ni escuchar en puerto
```

## 🚀 Deploy

```bash
git add .
git commit -m "fix: Vercel serverless configuration"
git push

# Vercel automáticamente:
# 1. Ejecuta: pnpm run build
# 2. Detecta: api/index.js como serverless function
# 3. Rewrites: todas las rutas → /api/index
# 4. Deploy: ✅
```

## 🔑 Variables de Entorno en Vercel

Dashboard: `https://vercel.com/[user]/first-backend/settings/environment-variables`

```env
# Agregar para Development + Preview + Production:
FIRST_PORT=3000
FIRST_MONGODB_URI=mongodb+srv://...
FIRST_SECRET_KEY=your-secret-key
FIRST_ENVIRONMENT=production
NODE_ENV=production
```

## ✅ Verificación Pre-Deploy

```bash
# 1. Build exitoso
pnpm run build
# ✓ dist/index.js existe

# 2. Export funciona
node -e "require('./dist/index').default"
# ✓ No errores

# 3. Wrapper carga
node api/index.js
# ✓ No output, no errores

# 4. Path aliases resueltos
grep "@Constants" dist/index.js
# ✓ Sin resultados (ya están convertidos)

# 5. Estructura correcta
ls api/index.js vercel.json
# ✓ Ambos archivos existen
```

## 🆚 Diferencia vs Configuración Anterior

### ❌ Antes (No funcionaba)

```json
// vercel.json
{
  "builds": [{ "src": "dist/index.js", "use": "@vercel/node" }],
  "routes": [{ "dest": "/dist/index.js" }]
}
```

**Problema:** 
- Vercel no sabía cómo manejar dist/index.js directamente
- Format de build/routes es legacy (Vercel v2 antiguo)
- NOT_FOUND error

### ✅ Ahora (Funciona)

```json
// vercel.json
{
  "buildCommand": "pnpm run build",
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }]
}
```

**Solución:**
- `api/index.js` es detectado automáticamente como serverless function
- `rewrites` es el approach moderno (no legacy routes)
- Vercel envuelve Express app automáticamente
- ✅ Funciona

## 📚 Referencias

- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Using Express with Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Vercel Build Configuration](https://vercel.com/docs/build-configurations)
