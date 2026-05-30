import { describe, it, expect } from 'vitest';
import {
	COLLABORATOR_PATH_LIST_PUBLIC,
	COLLABORATOR_PATH_LIST_ADMIN,
	COLLABORATOR_PATH_GET_BY_ID,
	COLLABORATOR_PATH_CREATE,
	COLLABORATOR_PATH_UPDATE,
	COLLABORATOR_PATH_DELETE,
} from '@Modules/collaborators/constants/paths';

describe('team paths constants', () => {
	it('exports expected path strings', () => {
		expect(COLLABORATOR_PATH_LIST_PUBLIC).toBe('/collaborators');
		expect(COLLABORATOR_PATH_LIST_ADMIN).toBe('/collaborators/admin');
		expect(COLLABORATOR_PATH_GET_BY_ID).toBe('/collaborators/:id');
		expect(COLLABORATOR_PATH_CREATE).toBe('/collaborators');
		expect(COLLABORATOR_PATH_UPDATE).toBe('/collaborators/:id');
		expect(COLLABORATOR_PATH_DELETE).toBe('/collaborators/:id');
	});

	it('admin path comes before parameterised path alphabetically', () => {
		expect(COLLABORATOR_PATH_LIST_ADMIN).toBe('/collaborators/admin');
		expect(COLLABORATOR_PATH_GET_BY_ID).toBe('/collaborators/:id');
	});
});
