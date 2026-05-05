import { ENV } from '@Constants/environments';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { sendEmail, passwordResetTemplate } from '@Modules/notifications-email';
import { logInfo } from '@Helpers/log';
import { UserModel } from '@Modules/users';

export async function forgotPassword(email: string) {
	const user = await UserModel.findOne({ email: email.toLowerCase() });

	if (!user) {
		logInfo(
			`[Auth] Forgot password requested for non-existent email: ${email}`,
		);
		return;
	}

	const token = JwtService.signEmail({ sub: user.id, type: 'password_reset' });
	const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${token}`;

	await sendEmail({
		to: user.email,
		...passwordResetTemplate({ firstName: user.firstName, resetUrl }),
	});
}
