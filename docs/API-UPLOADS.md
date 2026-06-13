# Contrato de subida de imágenes (multipart) — para el frontend

> Generado en la Fase 3 (2026-06-12). El backend ahora **dueño de la subida**: el front
> manda el archivo + los datos en **un solo request** y el backend procesa la subida.
> Antes el front subía a `/storage` y luego mandaba la URL — **eso ya no es necesario**.

## 1. Cómo se manda

Los endpoints de create/update que llevan imagen aceptan **dos formatos**:

### a) `multipart/form-data` (con archivo)
- Un part **`data`** = el **JSON del body** (string).
- Uno o más parts de **archivo** según el módulo (ver tabla §3).
- **No** pongas `Content-Type` a mano: el navegador/cliente fija el boundary.

```js
const fd = new FormData();
fd.append('data', JSON.stringify(payload)); // el body de siempre, como string
fd.append('logo', file);                    // el archivo (opcional)
await fetch(`/api/v1/clients`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` }, // SIN Content-Type
  body: fd,
});
```

### b) `application/json` (sin archivo)
Si no hay imagen, manda el body como JSON normal (igual que antes):
```js
await fetch(`/api/v1/clients`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```
> El backend detecta el part `data`; si no existe, usa el body JSON tal cual.

## 2. Restricciones de archivo
- **Tipos permitidos:** `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`.
- **Tamaño máx.:** 4 MB por imagen (`STORAGE_MAX_IMAGE_SIZE_BYTES`). Límite bajo a
  propósito por el body de funciones serverless en Vercel (~4.5 MB).
- El backend valida el tipo por **contenido** (magic bytes), no solo por la extensión.
- El backend genera variantes `full` (≤2000px) y `thumb` (700px) en webp para imágenes
  raster; guarda en la entidad la URL de display.

## 3. Endpoints, campos de archivo y campo destino

| Módulo | Método y ruta | Part(s) de archivo | Campo de la entidad |
|---|---|---|---|
| Clients | `POST /clients`, `PATCH /clients/:id` | `logo` | `logoUrl` |
| Users | `POST /users`, `PATCH /users/:id`, `PATCH /users/me` | `avatar` | `profilePictureUrl` |
| Collaborators | `POST /collaborators`, `PATCH /collaborators/:id` | `photo` | `photoUrl` |
| Portfolio | `POST /portfolio`, `PATCH /portfolio/:id` | `cover` | `coverImageUrl` |
| Services | `POST /services`, `PATCH /services/:id` | `cover` | `coverImageUrl` |
| App Settings | `PATCH /app-settings` | `logo`, `favicon` | `appearance.logoUrl`, `appearance.faviconUrl` |

> Nota: el campo de URL (`logoUrl`, etc.) sigue aceptándose en el JSON como fallback
> (p. ej. una URL externa). Si mandas archivo **y** URL, gana el archivo.

## 4. Respuestas

### Éxito total — `201`/`200`
```json
{ "success": true, "statusCode": 201, "code": "...", "data": { /* registro */ } }
```

### Éxito parcial (la imagen no se pudo subir, pero el registro sí) — `201`/`200`
```json
{
  "success": true,
  "data": { /* registro guardado, sin la imagen nueva */ },
  "warnings": [
    { "field": "logo", "code": "IMAGE_UPLOAD_FAILED", "message": "..." }
  ]
}
```
> **El front debe revisar `warnings[]`** y avisar al usuario que la imagen no se guardó
> (el resto del registro sí). No es un error: el status es 2xx.

### Errores (no se guarda nada)
| Status | code | Cuándo |
|---|---|---|
| `409` | `RESOURCE_DUPLICATE` | Clave única duplicada (p. ej. documento de cliente, email, slug). `details.keys` indica los campos. |
| `422` | `VALIDATION_SCHEMA_ERROR` | El `data` no pasó validación. `details.validation[]` con `path`/`message`. |
| `422` | `PORTFOLIO_COVER_REQUIRED` | Portfolio sin cover (ni archivo ni URL). |
| `415` | `FILE_TYPE_NOT_ALLOWED` / `MIME_TYPE_MISMATCH` | Tipo de archivo no permitido o el contenido no coincide. |
| `413` | `FILE_SIZE_EXCEEDED` | El archivo supera 4 MB. |
| `400` | `ERROR_INVALID_BODY` | El part `data` no es JSON válido. |

## 5. App Settings (caso especial)
`PATCH /app-settings` acepta **dos** archivos a la vez (`logo` y `favicon`) en el mismo
multipart, más el `data` con las categorías `general` / `notifications` / `appearance`.
Si solo mandas archivos (sin cambiar otros settings), igual funciona (el backend
considera la subida como cambio de `appearance`).

## 6. Checklist de migración del frontend

- [ ] **Quitar** la subida previa a `POST /storage` en los formularios de
      clients/users/collaborators/portfolio/services/app-settings.
- [ ] En cada form con imagen: construir `FormData` con `data` (JSON.stringify del payload)
      + el archivo en el campo correcto (§3). **No** setear `Content-Type` manualmente.
- [ ] Mantener el envío JSON cuando el usuario no cambia la imagen (no adjuntar archivo).
- [ ] En update: si el usuario sube una imagen nueva, el backend reemplaza la anterior y
      borra la vieja automáticamente — el front no gestiona el borrado.
- [ ] Tras la respuesta, **leer `warnings[]`**: si hay `IMAGE_UPLOAD_FAILED`, mostrar un
      aviso "el registro se guardó pero la imagen no se pudo subir".
- [ ] Validar en cliente tamaño (≤4 MB) y tipo (jpeg/png/webp/svg) para feedback rápido;
      el backend igual lo revalida.
- [ ] Para portfolio: la portada es obligatoria → exigir archivo **o** URL en el form.
- [ ] App Settings: permitir subir `logo` y `favicon` por separado en el mismo submit.
- [ ] Probar el caso `409 RESOURCE_DUPLICATE` (mostrar `details.keys`) y el `422` de
      validación.

> Colección Insomnia (`docs/insomnia.collection.json`) ya actualizada: los 12 requests de
> create/update afectados usan `multipart/form-data` con el part `data` + los parts de
> archivo. Importa la colección para probar el flujo.
