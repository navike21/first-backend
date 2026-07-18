import nodemailer, { Transporter } from 'nodemailer';
import { ENV } from '@Constants/environments';
import { logInfo } from '@Helpers/log';
import type { EmailTransport, SendEmailInput } from './EmailTransport';

let transporter: Transporter | undefined;

// Lógica reubicada del antiguo emailTransporter.ts: SMTP real si hay
// credenciales, o una cuenta Ethereal automática en dev (preview en
// https://ethereal.email). Cacheado en el módulo.
async function getTransporter(): Promise<Transporter> {
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

export const smtpTransport: EmailTransport = {
	name: 'smtp',
	async send({ from, to, subject, html }: SendEmailInput): Promise<void> {
		const t = await getTransporter();
		const info = await t.sendMail({ from, to, subject, html });
		const previewUrl = nodemailer.getTestMessageUrl(info);
		if (previewUrl) logInfo(`[Email] Preview: ${previewUrl}`);
	},
};
