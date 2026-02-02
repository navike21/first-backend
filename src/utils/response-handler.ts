import type { Response } from 'express';
import { randomUUID } from 'node:crypto';
import type {
  ApiResponse,
  ApiErrorDetail,
  ApiMeta,
  HttpStatusCode,
  ResponseType,
} from '../types/api-response.js';

/**
 * Genera metadata base para todas las respuestas
 */
function generateBaseMeta(additionalMeta?: Partial<ApiMeta>): ApiMeta {
  return {
    timestamp: new Date().toISOString(),
    requestId: randomUUID(),
    ...additionalMeta,
  };
}

/**
 * Función genérica para enviar cualquier respuesta
 */
export function sendApiResponse<TData = unknown>(
  res: Response,
  options: {
    status: HttpStatusCode;
    type: ResponseType;
    message: string;
    data?: TData;
    errors?: ApiErrorDetail[];
    meta?: Partial<ApiMeta>;
  }
): void {
  const { status, type, message, data = null, errors = null, meta } = options;

  const response: ApiResponse<TData> = {
    status,
    type,
    message,
    data,
    errors,
    meta: generateBaseMeta(meta),
  };

  res.status(status).json(response);
}

/**
 * Factory de helpers rápidos para respuestas comunes
 */
export const ApiResponder = {
  success: <TData>(
    res: Response,
    options: {
      data: TData;
      message?: string;
      status?: 200 | 201;
      meta?: Partial<ApiMeta>;
    }
  ) => {
    sendApiResponse(res, {
      status: options.status ?? 200,
      type: 'success',
      message: options.message ?? 'Success',
      data: options.data,
      errors: undefined,
      meta: options.meta,
    });
  },

  created: <TData>(
    res: Response,
    options: { data: TData; message?: string; meta?: Partial<ApiMeta> }
  ) => {
    ApiResponder.success(res, {
      ...options,
      status: 201,
      message: options.message ?? 'Resource created successfully',
    });
  },

  error: (
    res: Response,
    options: {
      message: string;
      status?: HttpStatusCode;
      errors?: ApiErrorDetail[];
      meta?: Partial<ApiMeta>;
    }
  ) => {
    sendApiResponse(res, {
      status: options.status ?? 500,
      type: 'error',
      message: options.message,
      data: null,
      errors: options.errors ?? undefined,
      meta: options.meta,
    });
  },

  // Shortcuts para códigos comunes
  badRequest: (
    res: Response,
    options?: {
      message?: string;
      errors?: ApiErrorDetail[];
      meta?: Partial<ApiMeta>;
    }
  ) =>
    ApiResponder.error(res, {
      status: 400,
      message: options?.message ?? 'Bad request',
      errors: options?.errors,
      meta: options?.meta,
    }),

  unauthorized: (
    res: Response,
    options?: { message?: string; meta?: Partial<ApiMeta> }
  ) =>
    ApiResponder.error(res, {
      status: 401,
      message: options?.message ?? 'Unauthorized',
      meta: options?.meta,
    }),

  forbidden: (
    res: Response,
    options?: { message?: string; meta?: Partial<ApiMeta> }
  ) =>
    ApiResponder.error(res, {
      status: 403,
      message: options?.message ?? 'Forbidden',
      meta: options?.meta,
    }),

  notFound: (
    res: Response,
    options?: { message?: string; resource?: string; meta?: Partial<ApiMeta> }
  ) =>
    ApiResponder.error(res, {
      status: 404,
      message:
        options?.message ?? `${options?.resource ?? 'Resource'} not found`,
      meta: options?.meta,
    }),

  conflict: (
    res: Response,
    options?: {
      message?: string;
      errors?: ApiErrorDetail[];
      meta?: Partial<ApiMeta>;
    }
  ) =>
    ApiResponder.error(res, {
      status: 409,
      message: options?.message ?? 'Conflict',
      errors: options?.errors,
      meta: options?.meta,
    }),

  validationError: (
    res: Response,
    options: {
      errors: ApiErrorDetail[];
      message?: string;
      meta?: Partial<ApiMeta>;
    }
  ) =>
    ApiResponder.error(res, {
      status: 422,
      message: options.message ?? 'Validation error',
      errors: options.errors,
      meta: options.meta,
    }),

  internalError: (
    res: Response,
    options?: { message?: string; error?: unknown; meta?: Partial<ApiMeta> }
  ) => {
    if (process.env.NODE_ENV === 'development' && options?.error) {
      console.error('Internal Server Error:', options.error);
    }
    ApiResponder.error(res, {
      status: 500,
      message:
        options?.message ?? 'Internal server error. Please try again later.',
      meta: options?.meta,
    });
  },
};

/**
 * Convierte errores de Zod a ApiErrorDetail[]
 */
export function formatZodErrors(zodError: unknown): ApiErrorDetail[] {
  if (
    typeof zodError === 'object' &&
    zodError !== null &&
    'issues' in zodError
  ) {
    const issues = (zodError as { issues: unknown[] }).issues;
    return issues.map((issue: unknown) => {
      const zodIssue = issue as {
        path?: (string | number)[];
        message: string;
        code?: string;
      };
      return {
        field: zodIssue.path?.join('.') || undefined,
        issue: zodIssue.message,
        code: zodIssue.code?.toUpperCase(),
      };
    });
  }
  return [];
}
