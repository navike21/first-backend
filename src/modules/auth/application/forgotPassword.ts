import { ENV } from '@Constants/environments';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { eventBus } from '@Shared/infrastructure/EventBus';
import { PasswordResetRequestedEvent } from '@Shared/events/emailEvents';
import { logInfo } from '@Helpers/log';
import { UserModel } from '@Modules/users';

export async function forgotPassword(email: string, lang = 'en') {
	const user = await UserModel.findOne({ email: email.toLowerCase() });

	if (!user) {
		logInfo(
			`[Auth] Forgot password requested for non-existent email: ${email}`,
		);
		return;
	}

	const token = JwtService.signEmail({ sub: user.id, type: 'password_reset' });
	const resetUrl = `${ENV.CLIENT_URL}/${lang}/reset-password?token=${token}`;

	await eventBus.publish(
		new PasswordResetRequestedEvent(user.email, user.firstName, resetUrl, lang),
	);
}
