import PageModel from '../infrastructure/PageModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PageNotFoundError } from '../domain/errors/PageErrors';
import type { SupportedLanguage } from '@Shared/types/localizedString';
import { publicVisibilityFilter } from './pageStatus';

/**
 * Public lookup by the denormalized `fullPath` (composed from every ancestor's
 * per-language slug, e.g. `nosotros/equipo`), not by a single slug segment —
 * slugs are only unique among siblings, so a bare slug can no longer identify
 * a page on its own.
 */
function stripSlashes(path: string): string {
	let start = 0;
	let end = path.length;
	while (start < end && path[start] === '/') start += 1;
	while (end > start && path[end - 1] === '/') end -= 1;
	return path.slice(start, end);
}

export async function resolvePageByPath(path: string, lang: SupportedLanguage) {
	const normalizedPath = stripSlashes(path);
	const doc = await PageModel.findOne({
		[`fullPath.${lang}`]: normalizedPath,
		...publicVisibilityFilter(),
	}).lean();
	if (!doc) throw new PageNotFoundError();
	return cleanMongoFields(doc);
}
