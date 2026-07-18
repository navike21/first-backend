import { Resend } from 'resend';
import { ENV } from '@Constants/environments';
import type { EmailTransport, SendEmailInput } from './EmailTransport';

let client: Resend | undefined;

function getClient(): Resend {
	if (!client) {
		if (!ENV.RESEND_API_KEY) {
			throw new Error('RESEND_API_KEY is not configured');
		}
		client = new Resend(ENV.RESEND_API_KEY);
	}
	return client;
}

export const resendTransport: EmailTransport = {
	name: 'resend',
	async send({ from, to, subject, html }: SendEmailInput): Promise<void> {
		// El SDK devuelve `{ data, error }` en vez de lanzar — se normaliza a una
		// excepción para que el outbox reintente igual que con cualquier fallo.
		const { error } = await getClient().emails.send({
			from,
			to,
			subject,
			html,
		});
		if (error) {
			throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
		}
	},
};
