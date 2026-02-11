import setThrowError from '@Helpers/setThrowError';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { isValidISODateString } from '@Helpers/isValidISODateString';
import type { SubscriberSchema } from '../types/subscriber.schema';

export const validateSchemaArray =
	<T>(schema: ZodType<T>) =>
	(req: Request, _: Response, next: NextFunction) => {
		if (!Array.isArray(req.body)) {
			setThrowError({
				code: 'VALIDATION_SCHEMA_ARRAY_ERROR',
				statusCode: 300,
				message: 'Request body must be an array',
			});
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
			setThrowError({
				code: 'VALIDATION_SCHEMA_ARRAY_ERROR',
				statusCode: 300,
				details: {
					validation: error.issues.map((issue) => ({
						index: issue.path[0],
						path: issue.path.slice(1).join('.'),
						message: issue.message,
					})),
				},
				message: 'Validation failed for one or more subscribers',
			});
		}

		req.body = data;
		next();
	};
