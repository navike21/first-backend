import { describe, it, expect, vi } from 'vitest';
import { withMongo } from '@test/withMongo';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { createUser } from '@Modules/users/application/createUser';
import { EmailAlreadyExistsError } from '@Modules/users/domain/errors/UserErrors';

withMongo();

vi.mock('@Modules/notifications-email', () => ({
	sendEmail: vi.fn().mockResolvedValue(undefined),
	verifyEmailTemplate: vi.fn().mockReturnValue({ subject: 'Verify', html: '<p/>' }),
}));

vi.mock('@Constants/environments', () => ({
	ENV: { CLIENT_URL: 'http://localhost:3000' },
}));

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { signEmail: vi.fn().mockReturnValue('EMAIL_TOKEN') },
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { hash: vi.fn().mockResolvedValue('hashed_pw') },
}));

const baseInput = {
	email: `user-${crypto.randomUUID().slice(0, 8)}@test.com`,
	password: 'Password1!',
	firstName: 'John',
	lastName: 'Doe',
	status: 'active' as const,
};

describe('createUser', () => {
	it('creates and persists a user in the database', async () => {
		const input = { ...baseInput, email: `u-${crypto.randomUUID().slice(0, 8)}@test.com` };

		const result = await createUser(input);

		expect(result.email).toBe(input.email);
		expect(result.firstName).toBe('John');

		const inDb = await UserModel.findOne({ id: result.id });
		expect(inDb).not.toBeNull();
		expect(inDb!.password).toBe('hashed_pw');
	});

	it('throws EmailAlreadyExistsError when email is already taken', async () => {
		const email = `dup-${crypto.randomUUID().slice(0, 8)}@test.com`;
		await createUser({ ...baseInput, email });

		await expect(createUser({ ...baseInput, email })).rejects.toBeInstanceOf(
			EmailAlreadyExistsError,
		);
	});

	it('converts dateOfBirth string to Date in the database', async () => {
		const input = {
			...baseInput,
			email: `dob-${crypto.randomUUID().slice(0, 8)}@test.com`,
			dateOfBirth: '1990-06-15',
		};

		const result = await createUser(input);

		const inDb = await UserModel.findOne({ id: result.id });
		expect(inDb!.dateOfBirth).toBeInstanceOf(Date);
	});

	it('passes lang to the email template', async () => {
		const { verifyEmailTemplate } = await import('@Modules/notifications-email');
		const input = { ...baseInput, email: `lang-${crypto.randomUUID().slice(0, 8)}@test.com` };

		await createUser(input, 'es');

		expect(verifyEmailTemplate).toHaveBeenCalledWith(
			expect.objectContaining({ lang: 'es' }),
		);
	});
});
