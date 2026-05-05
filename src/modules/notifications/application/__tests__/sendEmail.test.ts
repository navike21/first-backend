import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Transporter } from 'nodemailer';

const mockEnv = vi.hoisted(() => ({
	EMAIL_FROM: 'noreply@example.com',
	NODE_ENV: 'production',
}));

vi.mock('@Constants/environments', () => ({ ENV: mockEnv }));

vi.mock('@Modules/notifications/infrastructure/emailTransporter', () => ({
	getEmailTransporter: vi.fn(),
}));

vi.mock('@Helpers/log', () => ({
	logInfo: vi.fn(),
	logError: vi.fn(),
}));

vi.mock('nodemailer', () => ({
	default: {
		createTransport: vi.fn(),
		getTestMessageUrl: vi.fn(),
		createTestAccount: vi.fn(),
	},
}));

import { sendEmail } from '@Modules/notifications/application/sendEmail';
import { getEmailTransporter } from '@Modules/notifications/infrastructure/emailTransporter';
import { logInfo, logError } from '@Helpers/log';
import nodemailer from 'nodemailer';

describe('sendEmail', () => {
	afterEach(() => {
		mockEnv.NODE_ENV = 'production';
	});

	it('sends email in production without logging a preview URL', async () => {
		// Arrange
		const sendMailMock = vi.fn().mockResolvedValue({});
		vi.mocked(getEmailTransporter).mockResolvedValue({
			sendMail: sendMailMock,
		} as unknown as Transporter);

		// Act
		await sendEmail({
			to: 'user@example.com',
			subject: 'Hi',
			html: '<b>Hello</b>',
		});

		// Assert
		expect(sendMailMock).toHaveBeenCalledWith(
			expect.objectContaining({
				from: 'noreply@example.com',
				to: 'user@example.com',
			}),
		);
		expect(logInfo).not.toHaveBeenCalled();
	});

	it('logs the preview URL when sending in development mode', async () => {
		// Arrange
		mockEnv.NODE_ENV = 'development';
		const sentInfo = { messageId: 'test-id' };
		const sendMailMock = vi.fn().mockResolvedValue(sentInfo);
		vi.mocked(getEmailTransporter).mockResolvedValue({
			sendMail: sendMailMock,
		} as unknown as Transporter);
		vi.mocked(nodemailer.getTestMessageUrl).mockReturnValue(
			'https://ethereal.email/preview/abc',
		);

		// Act
		await sendEmail({
			to: 'user@example.com',
			subject: 'Hi',
			html: '<b>Hello</b>',
		});

		// Assert
		expect(nodemailer.getTestMessageUrl).toHaveBeenCalledWith(sentInfo);
		expect(logInfo).toHaveBeenCalledWith(
			'[Email] Preview: https://ethereal.email/preview/abc',
		);
	});

	it('does not log when preview URL is unavailable in development mode', async () => {
		// Arrange
		mockEnv.NODE_ENV = 'development';
		const sendMailMock = vi.fn().mockResolvedValue({});
		vi.mocked(getEmailTransporter).mockResolvedValue({
			sendMail: sendMailMock,
		} as unknown as Transporter);
		vi.mocked(nodemailer.getTestMessageUrl).mockReturnValue(false);

		// Act
		await sendEmail({
			to: 'user@example.com',
			subject: 'Hi',
			html: '<b>Hello</b>',
		});

		// Assert
		expect(logInfo).not.toHaveBeenCalled();
	});

	it('logs the error and rethrows when sendMail fails', async () => {
		// Arrange
		const sendMailMock = vi
			.fn()
			.mockRejectedValue(new Error('SMTP connection failed'));
		vi.mocked(getEmailTransporter).mockResolvedValue({
			sendMail: sendMailMock,
		} as unknown as Transporter);

		// Act & Assert
		await expect(
			sendEmail({ to: 'a@b.c', subject: 'X', html: '' }),
		).rejects.toThrow('SMTP connection failed');
		expect(logError).toHaveBeenCalled();
	});
});
