import setThrowError from '@Helpers/setThrowError';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

import { isValidISODateString } from '@Helpers/isValidISODateString';

const coerceNotesDates = (body: any) => {
	if (!body) return body;
	if (!Array.isArray(body?.contactPersons)) return body;

	return {
		...body,
		contactPersons: body.contactPersons.map((person: any) => {
			if (!Array.isArray(person?.notes)) return person;

			return {
				...person,
				notes: person.notes.map((note: any) => {
					const createdAt = note?.createdAt;
					return {
						...note,
						createdAt:
							typeof createdAt === 'string' && isValidISODateString(createdAt)
								? new Date(createdAt)
								: createdAt,
					};
				}),
			};
		}),
	};
};

export const validateUpdateSchema =
	<T>(schema: ZodType<T>) =>
	(req: Request, _: Response, next: NextFunction) => {
		const parseBody = coerceNotesDates(req.body);
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
