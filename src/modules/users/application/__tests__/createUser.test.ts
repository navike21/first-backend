import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import type { CreateUserInput } from '@Modules/users/schemas/user.schema';
import { createUser } from '@Modules/users/application/createUser';
import { EmailAlreadyExistsError } from '@Modules/users/domain/errors/UserErrors';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { sendEmail, verifyEmailTemplate } from '@Modules/notifications-email';
import { JwtService } from '@Shared/infrastructure/JwtService';

vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

vi.mock('@Modules/notifications-email', () => ({
	sendEmail: vi.fn(),
	verifyEmailTemplate: vi
		.fn()
		.mockReturnValue({ subject: 'Verify Email', html: '<p>Verify</p>' }),
}));

vi.mock('@Constants/environments', () => ({
	ENV: { CLIENT_URL: 'http://client.local' },
}));

vi.mock('@Shared/infrastructure/JwtService', () => ({
	JwtService: { signEmail: vi.fn().mockReturnValue('EMAIL_TOKEN') },
}));

vi.mock('@Modules/auth/domain/value-objects/HashedPassword', () => ({
	HashedPassword: { hash: vi.fn().mockResolvedValue('hashedPW') },
}));

type MockCreatedUser = Pick<
	UserDocument,
	'id' | 'email' | 'firstName' | 'lastName'
>;

describe('Users createUser', () => {
	const baseInput: CreateUserInput = {
		email: 'new@example.com',
		password: 'Password1!',
		firstName: 'New',
		lastName: 'User',
		status: 'active',
	};

	beforeEach(() => {
		vi.mocked(UserModel.findOne).mockReset();
		vi.mocked(UserModel.create).mockReset();
	});

	it('creates a user, sends a verification email, and returns user data', async () => {
		const created: MockCreatedUser = {
			id: 'u123',
			email: baseInput.email,
			firstName: baseInput.firstName,
			lastName: baseInput.lastName,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(null);
		vi.mocked(UserModel.create).mockResolvedValue(
			created as unknown as HydratedDocument<UserDocument>[],
		);

		const result = await createUser(baseInput, 'en');

		expect(UserModel.findOne).toHaveBeenCalledWith({ email: baseInput.email });
		expect(UserModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ email: baseInput.email, password: 'hashedPW' }),
		);
		expect(JwtService.signEmail).toHaveBeenCalledWith({
			sub: 'u123',
			type: 'email_verification',
		});
		expect(verifyEmailTemplate).toHaveBeenCalledWith({
			firstName: baseInput.firstName,
			verificationUrl: 'http://client.local/verify-email?token=EMAIL_TOKEN',
			lang: 'en',
		});
		expect(sendEmail).toHaveBeenCalledWith(
			expect.objectContaining({ to: baseInput.email }),
		);
		expect(result).toEqual({
			id: 'u123',
			email: baseInput.email,
			firstName: baseInput.firstName,
			lastName: baseInput.lastName,
		});
	});

	it('passes the provided lang to the verification email template', async () => {
		const created: MockCreatedUser = {
			id: 'u124',
			email: baseInput.email,
			firstName: baseInput.firstName,
			lastName: baseInput.lastName,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(null);
		vi.mocked(UserModel.create).mockResolvedValue(
			created as unknown as HydratedDocument<UserDocument>[],
		);

		await createUser(baseInput, 'es');

		expect(verifyEmailTemplate).toHaveBeenCalledWith(
			expect.objectContaining({ lang: 'es' }),
		);
	});

	it('defaults to English when no lang is provided', async () => {
		const created: MockCreatedUser = {
			id: 'u125',
			email: baseInput.email,
			firstName: baseInput.firstName,
			lastName: baseInput.lastName,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(null);
		vi.mocked(UserModel.create).mockResolvedValue(
			created as unknown as HydratedDocument<UserDocument>[],
		);

		await createUser(baseInput);

		expect(verifyEmailTemplate).toHaveBeenCalledWith(
			expect.objectContaining({ lang: 'en' }),
		);
	});

	it('converts dateOfBirth string to a Date object when provided', async () => {
		const inputWithDob: CreateUserInput = {
			...baseInput,
			dateOfBirth: '1990-06-15',
		};
		const created: MockCreatedUser = {
			id: 'u456',
			email: inputWithDob.email,
			firstName: inputWithDob.firstName,
			lastName: inputWithDob.lastName,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(null);
		vi.mocked(UserModel.create).mockResolvedValue(
			created as unknown as HydratedDocument<UserDocument>[],
		);

		const result = await createUser(inputWithDob);

		expect(UserModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ dateOfBirth: new Date('1990-06-15') }),
		);
		expect(result).toHaveProperty('id', 'u456');
	});

	it('throws EmailAlreadyExistsError when the email is already registered', async () => {
		vi.mocked(UserModel.findOne).mockResolvedValue({
			id: 'existing',
		} as unknown as HydratedDocument<UserDocument>);

		await expect(createUser(baseInput)).rejects.toBeInstanceOf(
			EmailAlreadyExistsError,
		);
	});
});
