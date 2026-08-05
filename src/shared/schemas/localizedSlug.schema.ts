import { z } from 'zod';
import { SUPPORTED_LANGUAGES } from '@Shared/types/localizedString';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Per-language slug — one shared shape for every module with a translatable
 * URL identifier (Services/Pages/Portfolio/Categories/Tags), parameterized
 * only by the module's own i18next invalid-slug error code and max length.
 * Each language is independently optional so a partial update can touch a
 * single language without requiring the rest.
 */
export function localizedSlugSchema(invalidMessage: string, maxLength: number) {
	return z.object(
		Object.fromEntries(
			SUPPORTED_LANGUAGES.map((l) => [
				l,
				z
					.string()
					.trim()
					.max(maxLength)
					.regex(slugRegex, { message: invalidMessage })
					.or(z.literal(''))
					.optional(),
			]),
		),
	);
}
