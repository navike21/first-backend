import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import { ENV } from '@Constants/environments';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { sendEmail, verifyEmailTemplate } from '@Modules/notifications-email';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { EmailAlreadyExistsError } from '../domain/errors/UserErrors';
import { CreateUserInput } from '../schemas/user.schema';

export async function createUser(input: CreateUserInput) {
	const existing = await UserModel.findOne({ email: input.email });
	if (existing) throw new EmailAlreadyExistsError();

	const hashedPassword = await HashedPassword.hash(input.password);
	const dateOfBirth = input.dateOfBirth
		? new Date(input.dateOfBirth)
		: undefined;

	const user = await UserModel.create({
		...input,
		password: hashedPassword,
		dateOfBirth,
	});

	const token = JwtService.signEmail({
		sub: user.id,
		type: 'email_verification',
	});
	const verificationUrl = `${ENV.CLIENT_URL}/verify-email?token=${token}`;

	await sendEmail({
		to: user.email,
		...verifyEmailTemplate({ firstName: user.firstName, verificationUrl }),
	});

	return {
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
	};
}
