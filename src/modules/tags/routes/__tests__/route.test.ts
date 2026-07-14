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
vi.mock('@Modules/tags/application/createTag', () => ({ createTag: vi.fn() }));
vi.mock('@Modules/tags/application/updateTag', () => ({ updateTag: vi.fn() }));
vi.mock('@Modules/tags/application/getTagById', () => ({
	getTagById: vi.fn(),
}));
vi.mock('@Modules/tags/application/listTags', () => ({ listTags: vi.fn() }));
vi.mock('@Modules/tags/application/deleteTag', () => ({ deleteTag: vi.fn() }));
vi.mock('@Modules/tags/application/purgeTag', () => ({ purgeTag: vi.fn() }));
vi.mock('@Modules/tags/application/restoreTag', () => ({
	restoreTag: vi.fn(),
}));
vi.mock('@Modules/tags/application/listDeletedTags', () => ({
	listDeletedTags: vi.fn(),
}));
vi.mock('@Modules/tags/application/deleteTagsBulk', () => ({
	deleteTagsBulk: vi.fn(),
}));
vi.mock('@Modules/tags/application/restoreTagsBulk', () => ({
	restoreTagsBulk: vi.fn(),
}));
vi.mock('@Modules/tags/application/purgeTagsBulk', () => ({
	purgeTagsBulk: vi.fn(),
}));

import { Router } from 'express';
import { tagsApi } from '@Modules/tags/routes/route';

describe('tagsApi route', () => {
	it('registers routes on the router without throwing', () => {
		const router = Router();
		expect(() => tagsApi(router)).not.toThrow();
	});
});
