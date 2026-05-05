import nodemailer from 'nodemailer';
import { ENV } from '@Constants/environments';
import { logError, logInfo } from '@Helpers/log';
import { getEmailTransporter } from '../infrastructure/emailTransporter';

interface SendEmailOptions {
	to: string;
	subject: string;
	html: string;
}

export async function sendEmail({
	to,
	subject,
	html,
}: SendEmailOptions): Promise<void> {
	try {
		const transporter = await getEmailTransporter();
		const info = await transporter.sendMail({
			from: ENV.EMAIL_FROM,
			to,
			subject,
			html,
		});

		if (ENV.NODE_ENV === 'development') {
			const previewUrl = nodemailer.getTestMessageUrl(info);
			if (previewUrl) logInfo(`[Email] Preview: ${previewUrl}`);
		}
	} catch (error) {
		logError(`[Email] Failed to send to ${to}: ${error}`);
		throw error;
	}
}
