import { z } from 'zod';

const langField = z.string().min(1, { message: 'LOCALIZED_FIELD_REQUIRED' });

export const LocalizedStringSchema = z.object({
	en: langField,
	es: langField,
	de: langField,
	fr: langField,
	it: langField,
	ja: langField,
	ko: langField,
	pt: langField,
	ru: langField,
	zh: langField,
});

export type LocalizedString = z.infer<typeof LocalizedStringSchema>;
