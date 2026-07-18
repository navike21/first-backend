import { ENV } from '@Constants/environments';
import type { EmailTransport } from './EmailTransport';
import { resendTransport } from './ResendTransport';
import { smtpTransport } from './SmtpTransport';

/**
 * Elige el transporte por env, sin que el resto del módulo sepa cuál corre:
 * - EMAIL_PROVIDER='resend' → Resend (requiere RESEND_API_KEY).
 * - EMAIL_PROVIDER='smtp'   → SMTP/Ethereal.
 * - 'auto' (default)        → Resend si hay RESEND_API_KEY, si no SMTP.
 */
export function getEmailTransport(): EmailTransport {
	if (ENV.EMAIL_PROVIDER === 'resend') return resendTransport;
	if (ENV.EMAIL_PROVIDER === 'smtp') return smtpTransport;
	return ENV.RESEND_API_KEY ? resendTransport : smtpTransport;
}
