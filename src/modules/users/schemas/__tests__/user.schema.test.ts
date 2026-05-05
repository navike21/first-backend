import { describe, it, expect } from 'vitest';
import {
	CreateUserSchema,
	UpdateUserSchema,
	UpdateMyProfileSchema,
	ListUsersQuerySchema,
} from '@Modules/users/schemas/user.schema';

describe('user.schema', () => {
	it('CreateUserSchema parses valid data', () => {
		const result = CreateUserSchema.safeParse({
			email: 'john@example.com',
			password: 'Password1',
			firstName: 'John',
			lastName: 'Doe',
		});
		expect(result.success).toBe(true);
	});

	it('CreateUserSchema rejects weak password', () => {
		const result = CreateUserSchema.safeParse({
			email: 'john@example.com',
			password: 'weak',
			firstName: 'John',
			lastName: 'Doe',
		});
		expect(result.success).toBe(false);
	});

	it('UpdateUserSchema allows partial data', () => {
		const result = UpdateUserSchema.safeParse({ firstName: 'Jane' });
		expect(result.success).toBe(true);
	});

	it('UpdateMyProfileSchema parses valid data', () => {
		const result = UpdateMyProfileSchema.safeParse({ firstName: 'Jane' });
		expect(result.success).toBe(true);
	});

	it('ListUsersQuerySchema parses valid query', () => {
		const result = ListUsersQuerySchema.safeParse({ page: '1', limit: '20' });
		expect(result.success).toBe(true);
	});

	it('ListUsersQuerySchema rejects page 0', () => {
		const result = ListUsersQuerySchema.safeParse({ page: '0' });
		expect(result.success).toBe(false);
	});
});
