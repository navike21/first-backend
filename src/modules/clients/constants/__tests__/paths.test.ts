import { describe, it, expect } from 'vitest';
import {
	CLIENT_PATH_LIST,
	CLIENT_PATH_CREATE,
	CLIENT_PATH_GET_BY_ID,
	CLIENT_PATH_UPDATE,
	CLIENT_PATH_DELETE,
} from '@Modules/clients/constants/paths';

describe('clients paths constants', () => {
	it('exports expected path strings', () => {
		expect(CLIENT_PATH_LIST).toBe('/clients');
		expect(CLIENT_PATH_CREATE).toBe('/clients');
		expect(CLIENT_PATH_GET_BY_ID).toBe('/clients/:id');
		expect(CLIENT_PATH_UPDATE).toBe('/clients/:id');
		expect(CLIENT_PATH_DELETE).toBe('/clients/:id');
	});
});
