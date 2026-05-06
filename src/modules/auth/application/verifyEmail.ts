import { JwtService } from '@Shared/infrastructure/JwtService';
import { sendEmail, welcomeEmailTemplate } from '@Modules/notifications-email';
import { UserModel } from '@Modules/users';
import { InvalidTokenError } from '../domain/errors/AuthErrors';
import { UserNotFoundError } from '@Modules/users/domain/errors/UserErrors';

export async function verifyEmail(token: string, lang = 'en') {
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
		...welcomeEmailTemplate({ firstName: user.firstName, lang }),
	});

	return { id: user.id, email: user.email };
}
