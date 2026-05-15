import { slugify } from 'transliteration';

export function generateSlug(text: string): string {
	return slugify(text, {
		lowercase: true,
		separator: '-',
		trim: true,
	});
}
