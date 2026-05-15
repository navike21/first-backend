import { describe, it, expect } from 'vitest';
import {
	TEAM_PATH_LIST_PUBLIC,
	TEAM_PATH_LIST_ADMIN,
	TEAM_PATH_GET_BY_ID,
	TEAM_PATH_CREATE,
	TEAM_PATH_UPDATE,
	TEAM_PATH_DELETE,
} from '@Modules/team/constants/paths';

describe('team paths constants', () => {
	it('exports expected path strings', () => {
		expect(TEAM_PATH_LIST_PUBLIC).toBe('/team');
		expect(TEAM_PATH_LIST_ADMIN).toBe('/team/admin');
		expect(TEAM_PATH_GET_BY_ID).toBe('/team/:id');
		expect(TEAM_PATH_CREATE).toBe('/team');
		expect(TEAM_PATH_UPDATE).toBe('/team/:id');
		expect(TEAM_PATH_DELETE).toBe('/team/:id');
	});

	it('admin path comes before parameterised path alphabetically', () => {
		expect(TEAM_PATH_LIST_ADMIN).toBe('/team/admin');
		expect(TEAM_PATH_GET_BY_ID).toBe('/team/:id');
	});
});
