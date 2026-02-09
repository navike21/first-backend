import setThrowError from '@Helpers/setThrowError';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

import { isValidISODateString } from '@Helpers/isValidISODateString';

const coerceNotesDates = (item: any) => {
	const contactPersons = Array.isArray(item?.contactPersons)
		? item.contactPersons
		: [];

	return {
		...item,
		contactPersons: contactPersons.map((person: any) => {
			const notes = Array.isArray(person?.notes) ? person.notes : [];
			return {
				...person,
				notes: notes.map((note: any) => {
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

		const parsedBody = req.body.map((item: any) => coerceNotesDates(item));

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
				message: 'Validation failed for one or more clients',
			});
		}

		req.body = data;
		next();
	};
