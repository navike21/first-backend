import setThrowError from '@Helpers/setThrowError';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { isValidISODateString } from '@Helpers/isValidISODateString';

export const validateUpdateSchema =
	<T>(schema: ZodType<T>) =>
	(req: Request, _: Response, next: NextFunction) => {
		const dateOfBirth = req.body?.personalInformation?.dateOfBirth;

		const parseBody = {
			...req.body,
			personalInformation: req.body?.personalInformation
				? {
						...req.body.personalInformation,
						dateOfBirth: isValidISODateString(dateOfBirth)
							? new Date(dateOfBirth)
							: dateOfBirth,
					}
				: undefined,
		};

		const { data, success, error } = schema.safeParse(parseBody);

		if (!success) {
			setThrowError({
				code: 'VALIDATION_SCHEMA_ERROR',
				statusCode: 300,
				details: {
					validation: error.issues.map((issue) => ({
						path: issue.path.join('.'),
						message: issue.message,
					})),
				},
				message: 'Validation failed for the provided data',
			});
		}

		req.body = data;
		next();
	};
