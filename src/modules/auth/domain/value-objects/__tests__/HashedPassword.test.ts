import { describe, it, expect } from 'vitest';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';

describe('HashedPassword', () => {
	it('hash() returns a bcrypt string', async () => {
		const hashed = await HashedPassword.hash('MyPassword1');
		expect(hashed).toMatch(/^\$2[ab]\$/);
	});

	it('compare() returns true for correct plaintext', async () => {
		const hashed = await HashedPassword.hash('MyPassword1');
		const result = await HashedPassword.compare('MyPassword1', hashed);
		expect(result).toBe(true);
	});

	it('compare() returns false for wrong plaintext', async () => {
		const hashed = await HashedPassword.hash('MyPassword1');
		const result = await HashedPassword.compare('WrongPassword', hashed);
		expect(result).toBe(false);
	});
});
