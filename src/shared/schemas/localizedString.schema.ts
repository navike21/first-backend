import { z } from 'zod';
import { sanitizeHtml } from '@Helpers/sanitizeHtml';

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

// For rich-text fields (rendered as HTML on the frontend via
// `dangerouslySetInnerHTML` — service/portfolio descriptions, collaborator
// bios). Sanitizes each language value server-side so a crafted API request
// (bypassing the Tiptap editor's own — client-side-only — constraints) can't
// store a stored-XSS payload that later executes for every visitor of a
// public page.
const htmlLangField = z.string().trim().transform(sanitizeHtml);

export const LocalizedHtmlStringSchema = z.object({
	en: htmlLangField,
	es: htmlLangField,
	de: htmlLangField,
	fr: htmlLangField,
	it: htmlLangField,
	ja: htmlLangField,
	ko: htmlLangField,
	pt: htmlLangField,
	ru: htmlLangField,
	zh: htmlLangField,
});
