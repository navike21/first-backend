import { z } from 'zod';
import type {
	ResponseConfig,
	ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';

/** The `multipart/form-data` request body shared by every create/update
 * endpoint that accepts an optional file (`acceptImage(field)` /
 * `acceptImageFields`): one `data` part (JSON string matching the given
 * body schema) + one binary file part per field name. */
export function multipartWithFile<T extends z.ZodTypeAny>(
	bodySchema: T,
	fileFields: string[],
	required = false,
): ZodRequestBody {
	const fileShape = Object.fromEntries(
		fileFields.map((field) => [
			field,
			z.string().openapi({ type: 'string', format: 'binary' }).optional(),
		]),
	);

	return {
		content: {
			'multipart/form-data': {
				schema: z.object({
					data: bodySchema.openapi({
						description: 'JSON-encoded string matching the schema below',
					}),
					...fileShape,
				}),
			},
		},
		required,
	};
}

const warningSchema = z.object({
	field: z.string(),
	code: z.string(),
	message: z.string(),
});

const metaSchema = z
	.object({
		page: z.number().optional(),
		limit: z.number().optional(),
		total: z.number().optional(),
		totalPages: z.number().optional(),
		timestamp: z.string().optional(),
		requestId: z.string().optional(),
	})
	.optional();

/** A 2xx envelope wrapping the given data schema — matches `successResponse()`. */
export function successResponse<T extends z.ZodTypeAny>(
	dataSchema: T,
	description = 'Success',
): ResponseConfig {
	return {
		description,
		content: {
			'application/json': {
				schema: z.object({
					success: z.literal(true),
					statusCode: z.number(),
					message: z.string(),
					data: dataSchema,
					meta: metaSchema,
					warnings: z.array(warningSchema).optional(),
				}),
			},
		},
	};
}

function errorResponse(description: string): ResponseConfig {
	return {
		description,
		content: {
			'application/json': {
				schema: z.object({
					success: z.literal(false),
					statusCode: z.number(),
					message: z.string(),
					code: z.string(),
					error: z
						.object({ code: z.string(), details: z.unknown().optional() })
						.optional(),
				}),
			},
		},
	};
}

/** Reusable error responses — matches `errorMiddleware` / `AppError`. Spread the
 * subset relevant to a given route into its `responses` map. */
export const commonErrorResponses = {
	400: errorResponse('Bad request'),
	401: errorResponse('Missing or invalid access token'),
	403: errorResponse('Insufficient permissions'),
	404: errorResponse('Resource not found'),
	409: errorResponse('Conflict — duplicate resource'),
	422: errorResponse('Validation error — see error.details.validation'),
	429: errorResponse('Too many requests'),
};

/** `{ ids: string[] }` — the shared body shape for every bulk endpoint
 * (`@Shared/schemas/bulkIds.schema`). Kept as a plain literal here (rather
 * than importing that module) so this stays a leaf, dependency-free file. */
export const bulkIdsRequestSchema = z.object({
	ids: z.array(z.uuid()).min(1).max(100),
});

/** `{ processed, processedIds, notFoundIds }` — the shared bulk-outcome shape
 * every bulk delete/restore/purge endpoint returns (`helpers/bulkOutcome`). */
export function bulkResultSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		processed: z.array(itemSchema),
		processedIds: z.array(z.uuid()),
		notFoundIds: z.array(z.uuid()),
	});
}

/** Standard `?page&limit` pagination meta returned alongside a list. */
export const paginationMetaSchema = z.object({
	page: z.number(),
	limit: z.number(),
	total: z.number(),
	totalPages: z.number(),
});
