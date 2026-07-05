import { z } from 'zod';

// Each language field is optional (empty string allowed); callers enforce that
// at least the primary language is present via their own schema refinements.
const langField = z.string().trim();

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
