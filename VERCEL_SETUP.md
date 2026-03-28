# Vercel Environment Variables

Para que tu aplicación funcione en Vercel, debes configurar estas variables en el dashboard de Vercel:

## Variables requeridas:

1. Ve a: https://vercel.com/[tu-usuario]/first-backend/settings/environment-variables

2. Agrega estas variables:

### Development + Preview + Production:

```
FIRST_PORT=3000
FIRST_MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/?appName=tu-app
FIRST_SECRET_KEY=tu-secret-key-here
FIRST_URL_ORIGINS=https://tu-dominio.vercel.app
FIRST_JWT_EXPIRES_IN=7d
FIRST_ENVIRONMENT=production
NODE_ENV=production
```

O usa los nombres sin prefijo:

```
PORT=3000
MONGO_URI=mongodb+srv://...
NODE_ENV=production
```

## Verificar deployment:

Después de hacer push:
```bash
git push
```

Vercel automáticamente:
1. Ejecutará `vercel-build` (compila TypeScript + resuelve path aliases)
2. Usará el código compilado en `dist/index.js`
3. Todas las referencias `@Constants/*` estarán convertidas a rutas relativas

## Testing local antes de deploy:

```bash
# Build
pnpm run build

# Verificar que los path aliases se resolvieron:
cat dist/index.js | grep -i "constants"
# Debería mostrar: require("./constants/environments")
# NO debe mostrar: @Constants

# Test del build
node --env-file=.env dist/index.js
```
