import type { ZodType } from 'zod';
import { AppError } from '@Shared/domain/AppError';

/**
 * Validates `data` against a Zod schema, throwing 422 `VALIDATION_SCHEMA_ERROR`
 * (with `details.validation[]`) on failure and returning the typed parsed value.
 * The canonical validation utility — replaces the inline safeParse boilerplate
 * and the ad-hoc per-module validation middlewares.
 */
export function validate<T>(schema: ZodType<T>, data: unknown): T {
	const result = schema.safeParse(data);
	if (!result.success) {
		AppError.unprocessable(
			'VALIDATION_SCHEMA_ERROR',
			'Validation failed for the provided data',
			{
				validation: result.error.issues.map((issue) => ({
					path: issue.path.join('.'),
					message: issue.message,
				})),
			},
		);
	}
	return result.data;
}

/**
 * Validates that `data` is an array whose items match the schema, throwing
 * 422 `VALIDATION_SCHEMA_ARRAY_ERROR` on failure. Item errors carry their `index`.
 */
export function validateArray<T>(schema: ZodType<T>, data: unknown): T[] {
	if (!Array.isArray(data)) {
		AppError.unprocessable(
			'VALIDATION_SCHEMA_ARRAY_ERROR',
			'Request body must be an array',
		);
	}
	const result = schema.array().safeParse(data);
	if (!result.success) {
		AppError.unprocessable(
			'VALIDATION_SCHEMA_ARRAY_ERROR',
			'Validation failed for one or more items',
			{
				validation: result.error.issues.map((issue) => ({
					index: issue.path[0],
					path: issue.path.slice(1).join('.'),
					message: issue.message,
				})),
			},
		);
	}
	return result.data;
}
