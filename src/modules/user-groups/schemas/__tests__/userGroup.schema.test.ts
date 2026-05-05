import { describe, it, expect } from 'vitest';
import {
	CreateUserGroupSchema,
	UpdateUserGroupSchema,
	ListUserGroupsQuerySchema,
} from '@Modules/user-groups/schemas/userGroup.schema';

describe('userGroup.schema', () => {
	it('CreateUserGroupSchema parses valid data', () => {
		const result = CreateUserGroupSchema.safeParse({ name: 'Admins' });
		expect(result.success).toBe(true);
	});

	it('CreateUserGroupSchema rejects short name', () => {
		const result = CreateUserGroupSchema.safeParse({ name: 'A' });
		expect(result.success).toBe(false);
	});

	it('UpdateUserGroupSchema allows partial data', () => {
		const result = UpdateUserGroupSchema.safeParse({ name: 'New Name' });
		expect(result.success).toBe(true);
	});

	it('ListUserGroupsQuerySchema parses valid query', () => {
		const result = ListUserGroupsQuerySchema.safeParse({
			page: '1',
			limit: '10',
		});
		expect(result.success).toBe(true);
	});

	it('ListUserGroupsQuerySchema rejects invalid page', () => {
		const result = ListUserGroupsQuerySchema.safeParse({ page: '0' });
		expect(result.success).toBe(false);
	});
});
