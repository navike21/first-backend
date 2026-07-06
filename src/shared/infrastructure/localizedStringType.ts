// No `required` — Mongoose treats "" as falsy for required checks, which would
// reject empty strings for non-primary languages. Zod validates structure upstream.
export const localizedStringType = {
	en: { type: String, default: '' },
	es: { type: String, default: '' },
	de: { type: String, default: '' },
	fr: { type: String, default: '' },
	it: { type: String, default: '' },
	ja: { type: String, default: '' },
	ko: { type: String, default: '' },
	pt: { type: String, default: '' },
	ru: { type: String, default: '' },
	zh: { type: String, default: '' },
} as const;
