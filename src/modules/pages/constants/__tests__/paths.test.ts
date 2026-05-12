import { describe, it, expect } from 'vitest';
import {
	PAGES_PATH_LIST_PUBLIC,
	PAGES_PATH_LIST_ADMIN,
	PAGES_PATH_GET_BY_SLUG,
	PAGES_PATH_CREATE,
	PAGES_PATH_UPDATE,
	PAGES_PATH_DELETE,
	PAGES_PATH_SECTION_ADD,
	PAGES_PATH_SECTION_UPDATE,
	PAGES_PATH_SECTION_DELETE,
	PAGES_PATH_SECTIONS_REORDER,
} from '@Modules/pages/constants/paths';

describe('pages paths constants', () => {
	it('exports expected path strings', () => {
		expect(PAGES_PATH_LIST_PUBLIC).toBe('/pages');
		expect(PAGES_PATH_LIST_ADMIN).toBe('/pages/admin');
		expect(PAGES_PATH_GET_BY_SLUG).toBe('/pages/:slug');
		expect(PAGES_PATH_CREATE).toBe('/pages');
		expect(PAGES_PATH_UPDATE).toBe('/pages/:slug');
		expect(PAGES_PATH_DELETE).toBe('/pages/:slug');
		expect(PAGES_PATH_SECTION_ADD).toBe('/pages/:slug/sections');
		expect(PAGES_PATH_SECTION_UPDATE).toBe('/pages/:slug/sections/:sectionId');
		expect(PAGES_PATH_SECTION_DELETE).toBe('/pages/:slug/sections/:sectionId');
		expect(PAGES_PATH_SECTIONS_REORDER).toBe('/pages/:slug/sections/reorder');
	});
});
