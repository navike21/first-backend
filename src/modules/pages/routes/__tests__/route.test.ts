import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Helpers/responseStructure', () => ({
	successResponse: vi.fn(),
	errorResponse: vi.fn(),
}));
vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { verifyAccess: vi.fn() },
}));
vi.mock('@Modules/storage', () => ({
	acceptImage: vi.fn(() => [(_req: unknown, _res: unknown, next: () => void) => next()]),
	uploadImageSafe: vi.fn(),
	deleteEntityFiles: vi.fn(),
	deleteStorageFilesByIds: vi.fn(),
}));
vi.mock('@Modules/pages/application/createPage', () => ({
	createPage: vi.fn(),
}));
vi.mock('@Modules/pages/application/listPages', () => ({
	listPages: vi.fn(),
}));
vi.mock('@Modules/pages/application/resolvePageByPath', () => ({
	resolvePageByPath: vi.fn(),
}));
vi.mock('@Modules/pages/application/getPageById', () => ({
	getPageById: vi.fn(),
}));
vi.mock('@Modules/pages/application/updatePage', () => ({
	updatePage: vi.fn(),
}));
vi.mock('@Modules/pages/application/deletePage', () => ({
	deletePage: vi.fn(),
}));
vi.mock('@Modules/pages/application/deletePagePhysical', () => ({
	deletePagePhysical: vi.fn(),
}));
vi.mock('@Modules/pages/application/restorePage', () => ({
	restorePage: vi.fn(),
}));
vi.mock('@Modules/pages/application/listDeletedPages', () => ({
	listDeletedPages: vi.fn(),
}));
vi.mock('@Modules/pages/application/deletePagesBulk', () => ({
	deletePagesBulk: vi.fn(),
}));
vi.mock('@Modules/pages/application/restorePagesBulk', () => ({
	restorePagesBulk: vi.fn(),
}));
vi.mock('@Modules/pages/application/purgePagesBulk', () => ({
	purgePagesBulk: vi.fn(),
}));
vi.mock('@Modules/pages/application/pageRevisions', () => ({
	listPageRevisions: vi.fn(),
	restorePageRevision: vi.fn(),
	recordPageRevision: vi.fn(),
}));
vi.mock('@Modules/pages/application/addSection', () => ({
	addSection: vi.fn(),
}));
vi.mock('@Modules/pages/application/updateSection', () => ({
	updateSection: vi.fn(),
}));
vi.mock('@Modules/pages/application/deleteSection', () => ({
	deleteSection: vi.fn(),
}));
vi.mock('@Modules/pages/application/reorderSections', () => ({
	reorderSections: vi.fn(),
}));

import { Router } from 'express';
import { pagesApi } from '@Modules/pages/routes/route';

describe('pagesApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => pagesApi(router)).not.toThrow();
	});
});
