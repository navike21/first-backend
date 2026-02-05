// -----------------------------------------
// Códigos HTTP más comunes (tipado literal)
// -----------------------------------------
export type HttpStatusCode =
  // 2xx - Éxito
  | 200 // OK
  | 201 // Created
  | 202 // Accepted
  | 203 // Non-Authoritative Information
  | 204 // No Content
  // 3xx - Redirección
  | 300 // Multiple Choices
  | 301 // Moved Permanently
  | 302 // Found
  | 303 // See Other
  | 304 // Not Modified
  // 4xx - Error del cliente
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 405 // Method Not Allowed
  | 409 // Conflict
  | 422 // Unprocessable Entity
  // 5xx - Error del servidor
  | 500 // Internal Server Error
  | 502 // Bad Gateway
  | 503 // Service Unavailable
  | 504; // Gateway Timeout

// ------------------------
// Tipo de respuesta (frontend-friendly)
// ------------------------
export type ResponseType = 'success' | 'error' | 'warning' | 'info';

// ------------------------
// Error individual
// ------------------------
export interface ApiErrorDetail {
  readonly field?: string; // campo del formulario donde ocurrió el error
  readonly code: string; // código de error (ej: EMAIL_INVALID, PASSWORD_MIN_LENGTH)
  readonly message: string; // mensaje descriptivo del error
}

// ------------------------
// Información adicional opcional
// ------------------------
export interface ApiMeta {
  readonly timestamp: string; // ISO string de la fecha/hora
  readonly requestId?: string; // id de request para logs
  readonly pagination?: {
    readonly page: number;
    readonly perPage: number;
    readonly total: number;
    readonly totalPages?: number;
  };
  readonly [key: string]: unknown; // permite info extra sin romper tipado
}

// ------------------------
// Respuesta principal genérica de API
// ------------------------
export interface ApiResponse<TData = unknown> {
  readonly status: HttpStatusCode; // código HTTP
  readonly type: ResponseType; // tipo de mensaje
  readonly code?: string; // código de error interno (p.ej. USER_NOT_FOUND)
  readonly message: string; // mensaje amigable
  readonly data: TData | null; // datos o null si hay error
  readonly errors?: ApiErrorDetail[] | null; // detalles de errores, opcional
  readonly meta?: ApiMeta; // info adicional, opcional
}
