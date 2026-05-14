import { AppError } from '@Shared/domain/AppError';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { isValidISODateString } from '@Helpers/isValidISODateString';
import type { SubscriberSchema } from '../types/subscriber.schema';

export const validateSchemaArray =
	<T>(schema: ZodType<T>) =>
	(req: Request, _: Response, next: NextFunction) => {
		if (!Array.isArray(req.body)) {
			AppError.unprocessable('VALIDATION_SCHEMA_ARRAY_ERROR', 'Request body must be an array');
		}

		const parsedBody = req.body.map((item: SubscriberSchema) => {
			const dateOfBirth = item?.personalInformation?.dateOfBirth;

			return {
				...item,
				personalInformation: {
					...item.personalInformation,
					dateOfBirth:
						typeof dateOfBirth === 'string' && isValidISODateString(dateOfBirth)
							? new Date(dateOfBirth)
							: dateOfBirth,
				},
			};
		});

		const { data, success, error } = schema.array().safeParse(parsedBody);

		if (!success) {
			AppError.unprocessable('VALIDATION_SCHEMA_ARRAY_ERROR', 'Validation failed for one or more subscribers', {
				validation: error.issues.map((issue) => ({
					index: issue.path[0],
					path: issue.path.slice(1).join('.'),
					message: issue.message,
				})),
			});
		}

		req.body = data;
		next();
	};
