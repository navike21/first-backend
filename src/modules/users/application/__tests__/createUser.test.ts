import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HydratedDocument } from 'mongoose';
import type { UserDocument } from '@Modules/users/infrastructure/UserModel';
import type { CreateUserInput } from '@Modules/users/schemas/user.schema';
import { createUser } from '@Modules/users/application/createUser';
import { EmailAlreadyExistsError } from '@Modules/users/domain/errors/UserErrors';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { sendEmail, verifyEmailTemplate } from '@Modules/notifications';
import { JwtService } from '@Shared/infrastructure/JwtService';

vi.mock('@Modules/users/infrastructure/UserModel', () => ({
	default: { findOne: vi.fn(), create: vi.fn() },
}));

vi.mock('@Modules/notifications', () => ({
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
		// Arrange
		const created: MockCreatedUser = {
			id: 'u123',
			email: baseInput.email,
			firstName: baseInput.firstName,
			lastName: baseInput.lastName,
		};
		vi.mocked(UserModel.findOne).mockResolvedValue(null);
		vi.mocked(UserModel.create).mockResolvedValue(
			created as unknown as HydratedDocument<UserDocument>,
		);

		// Act
		const result = await createUser(baseInput);

		// Assert
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

	it('converts dateOfBirth string to a Date object when provided', async () => {
		// Arrange
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
			created as unknown as HydratedDocument<UserDocument>,
		);

		// Act
		const result = await createUser(inputWithDob);

		// Assert
		expect(UserModel.create).toHaveBeenCalledWith(
			expect.objectContaining({ dateOfBirth: new Date('1990-06-15') }),
		);
		expect(result).toHaveProperty('id', 'u456');
	});

	it('throws EmailAlreadyExistsError when the email is already registered', async () => {
		// Arrange
		vi.mocked(UserModel.findOne).mockResolvedValue({
			id: 'existing',
		} as unknown as HydratedDocument<UserDocument>);

		// Act & Assert
		await expect(createUser(baseInput)).rejects.toBeInstanceOf(
			EmailAlreadyExistsError,
		);
	});
});
