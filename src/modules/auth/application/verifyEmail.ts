import { JwtService } from '@Shared/infrastructure/JwtService';
import { sendEmail, welcomeEmailTemplate } from '@Modules/notifications-email';
import { UserModel } from '@Modules/users';
import {
	InvalidTokenError,
	UserNotFoundError,
} from '../domain/errors/AuthErrors';

export async function verifyEmail(token: string) {
	let payload;
	try {
		payload = JwtService.verifyEmail(token);
	} catch {
		throw new InvalidTokenError();
	}

	if (payload.type !== 'email_verification') throw new InvalidTokenError();

	const user = await UserModel.findOneAndUpdate(
		{ id: payload.sub, isEmailVerified: false },
		{ $set: { isEmailVerified: true } },
		{ new: true },
	);

	if (!user) throw new UserNotFoundError();

	await sendEmail({
		to: user.email,
		...welcomeEmailTemplate({ firstName: user.firstName }),
	});

	return { id: user.id, email: user.email };
}
