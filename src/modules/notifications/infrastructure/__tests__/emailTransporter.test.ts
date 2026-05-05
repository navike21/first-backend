import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Transporter } from 'nodemailer';

describe('email transporter', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('creates an SMTP transporter in production and caches it on repeated calls', async () => {
		// Arrange
		const mockTransporter = { sendMail: vi.fn() } as unknown as Transporter;
		vi.doMock('nodemailer', () => ({
			default: {
				createTransport: vi.fn().mockReturnValue(mockTransporter),
				createTestAccount: vi.fn(),
				getTestMessageUrl: vi.fn(),
			},
		}));
		vi.doMock('@Constants/environments', () => ({
			ENV: {
				EMAIL_HOST: 'smtp.example.com',
				EMAIL_PORT: 587,
				EMAIL_USER: 'user',
				EMAIL_PASS: 'pass',
			},
		}));
		vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn(), logError: vi.fn() }));

		const { getEmailTransporter } =
			await import('@Modules/notifications/infrastructure/emailTransporter');
		const nodemailerModule = await import('nodemailer');

		// Act — first call creates the transporter
		const first = await getEmailTransporter();
		// Act — second call returns the cached instance
		const second = await getEmailTransporter();

		// Assert
		expect(nodemailerModule.default.createTransport).toHaveBeenCalledTimes(1);
		expect(nodemailerModule.default.createTransport).toHaveBeenCalledWith({
			host: 'smtp.example.com',
			port: 587,
			secure: false,
			auth: { user: 'user', pass: 'pass' },
		});
		expect(first).toBe(mockTransporter);
		expect(second).toBe(first);
	});

	it('creates an Ethereal transporter in development when SMTP is not configured', async () => {
		// Arrange
		const testAccount = { user: 'dev@ethereal.email', pass: 'devpass' };
		const mockTransporter = { sendMail: vi.fn() } as unknown as Transporter;
		vi.doMock('nodemailer', () => ({
			default: {
				createTransport: vi.fn().mockReturnValue(mockTransporter),
				createTestAccount: vi.fn().mockResolvedValue(testAccount),
				getTestMessageUrl: vi.fn(),
			},
		}));
		vi.doMock('@Constants/environments', () => ({
			ENV: {
				EMAIL_HOST: undefined,
				EMAIL_USER: undefined,
				EMAIL_PASS: undefined,
			},
		}));
		vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn(), logError: vi.fn() }));

		const { getEmailTransporter } =
			await import('@Modules/notifications/infrastructure/emailTransporter');
		const nodemailerModule = await import('nodemailer');

		// Act
		const result = await getEmailTransporter();

		// Assert
		expect(nodemailerModule.default.createTestAccount).toHaveBeenCalledTimes(1);
		expect(nodemailerModule.default.createTransport).toHaveBeenCalledWith({
			host: 'smtp.ethereal.email',
			port: 587,
			auth: { user: testAccount.user, pass: testAccount.pass },
		});
		expect(result).toBe(mockTransporter);
	});
});
