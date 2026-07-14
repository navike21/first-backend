import { describe, it, expect } from 'vitest';
import {
	PAGES_PATH_LIST_PUBLIC,
	PAGES_PATH_LIST_ADMIN,
	PAGES_PATH_RESOLVE_PUBLIC,
	PAGES_PATH_GET_BY_ID,
	PAGES_PATH_CREATE,
	PAGES_PATH_UPDATE,
	PAGES_PATH_DELETE,
	PAGES_PATH_SECTION_ADD,
	PAGES_PATH_SECTION_UPDATE,
	PAGES_PATH_SECTION_DELETE,
	PAGES_PATH_SECTIONS_REORDER,
	PAGES_PATH_REVISIONS_LIST,
	PAGES_PATH_REVISIONS_RESTORE,
} from '@Modules/pages/constants/paths';

describe('pages paths constants', () => {
	it('exports expected path strings', () => {
		expect(PAGES_PATH_LIST_PUBLIC).toBe('/pages');
		expect(PAGES_PATH_LIST_ADMIN).toBe('/pages/admin');
		expect(PAGES_PATH_RESOLVE_PUBLIC).toBe('/pages/resolve');
		expect(PAGES_PATH_GET_BY_ID).toBe('/pages/:id');
		expect(PAGES_PATH_CREATE).toBe('/pages');
		expect(PAGES_PATH_UPDATE).toBe('/pages/:id');
		expect(PAGES_PATH_DELETE).toBe('/pages/:id');
		expect(PAGES_PATH_SECTION_ADD).toBe('/pages/:id/sections');
		expect(PAGES_PATH_SECTION_UPDATE).toBe('/pages/:id/sections/:sectionId');
		expect(PAGES_PATH_SECTION_DELETE).toBe('/pages/:id/sections/:sectionId');
		expect(PAGES_PATH_SECTIONS_REORDER).toBe('/pages/:id/sections/reorder');
		expect(PAGES_PATH_REVISIONS_LIST).toBe('/pages/:id/revisions');
		expect(PAGES_PATH_REVISIONS_RESTORE).toBe(
			'/pages/:id/revisions/:revisionId/restore',
		);
	});
});
