import setThrowError from '@Helpers/setThrowError';
import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

import { isValidISODateString } from '@Helpers/isValidISODateString';

const coerceNotesDates = (body: any) => {
	const contactPersons = Array.isArray(body?.contactPersons)
		? body.contactPersons
		: [];

	const mappedContactPersons = contactPersons.map((person: any) => {
		const notes = Array.isArray(person?.notes) ? person.notes : [];
		const mappedNotes = notes.map((note: any) => {
			const createdAt = note?.createdAt;
			return {
				...note,
				createdAt:
					typeof createdAt === 'string' && isValidISODateString(createdAt)
						? new Date(createdAt)
						: createdAt,
			};
		});

		return {
			...person,
			notes: mappedNotes,
		};
	});

	return {
		...body,
		contactPersons: mappedContactPersons,
	};
};

export const validateSchema =
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
