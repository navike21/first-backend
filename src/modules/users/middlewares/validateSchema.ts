import setThrowError from '@Helpers/setThrowError';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { UserSchema } from '../types/user.schema';

export const validateSchema =
	<T>(schema: ZodType<T>) =>
	(req: Request, _: Response, next: NextFunction) => {
		const parseBody: UserSchema = {
			...req.body,
			personalInformation: {
				...req.body.personalInformation,
				dateOfBirth: new Date(req.body.personalInformation?.dateOfBirth),
			},
		};
		const { data, success, error } = schema.safeParse(parseBody);

		if (!success) {
			setThrowError({
				code: 'VALIDATION_ERROR',
				statusCode: 300,
				details: {
					validation: error.issues.map((issue) => ({
						path: issue.path.join('.'),
						message: issue.message,
					})),
				},
				message: 'Validation failed',
			});
		}

		req.body = data;
		next();
	};
