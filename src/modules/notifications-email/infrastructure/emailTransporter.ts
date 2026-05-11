import nodemailer, { Transporter } from 'nodemailer';
import { ENV } from '@Constants/environments';
import { logInfo } from '@Helpers/log';

let transporter: Transporter;

export async function getEmailTransporter(): Promise<Transporter> {
	if (transporter) return transporter;

	if (ENV.EMAIL_HOST && ENV.EMAIL_USER && ENV.EMAIL_PASS) {
		transporter = nodemailer.createTransport({
			host: ENV.EMAIL_HOST,
			port: ENV.EMAIL_PORT,
			secure: ENV.EMAIL_PORT === 465,
			requireTLS: ENV.EMAIL_PORT !== 465,
			auth: { user: ENV.EMAIL_USER, pass: ENV.EMAIL_PASS },
		});
	} else {
		// Dev: Ethereal auto-account (preview en https://ethereal.email)
		const testAccount = await nodemailer.createTestAccount();
		transporter = nodemailer.createTransport({
			host: testAccount.smtp.host,
			port: testAccount.smtp.port,
			secure: testAccount.smtp.secure,
			auth: { user: testAccount.user, pass: testAccount.pass },
		});
		logInfo(`[Email] Dev mode — Ethereal account: ${testAccount.user}`);
	}

	return transporter;
}
