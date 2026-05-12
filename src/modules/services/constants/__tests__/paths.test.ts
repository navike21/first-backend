import { describe, it, expect } from 'vitest';
import {
	SERVICE_PATH_LIST_PUBLIC,
	SERVICE_PATH_LIST_ADMIN,
	SERVICE_PATH_GET_BY_SLUG,
	SERVICE_PATH_CREATE,
	SERVICE_PATH_UPDATE,
	SERVICE_PATH_DELETE,
} from '@Modules/services/constants/paths';

describe('services paths constants', () => {
	it('exports expected path strings', () => {
		expect(SERVICE_PATH_LIST_PUBLIC).toBe('/services');
		expect(SERVICE_PATH_LIST_ADMIN).toBe('/services/admin');
		expect(SERVICE_PATH_GET_BY_SLUG).toBe('/services/:slug');
		expect(SERVICE_PATH_CREATE).toBe('/services');
		expect(SERVICE_PATH_UPDATE).toBe('/services/:id');
		expect(SERVICE_PATH_DELETE).toBe('/services/:id');
	});
});
