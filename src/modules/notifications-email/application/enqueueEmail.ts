import { ENV } from '@Constants/environments';
import { logError } from '@Helpers/log';
import EmailOutboxModel from '../infrastructure/EmailOutboxModel';
import { dispatchPendingEmails } from './dispatchOutbox';

export interface EnqueueEmailInput {
	to: string;
	subject: string;
	html: string;
	/** Remitente; por defecto ENV.EMAIL_FROM. */
	from?: string;
}

/**
 * API pública y agnóstica del envío de correo: cualquier módulo la invoca
 * (`import { enqueueEmail } from '@Modules/notifications-email'`). Persiste el
 * correo en el outbox (durable) y retorna de inmediato — no envía en línea, así
 * que la latencia/fallos del proveedor nunca bloquean ni tumban el request. El
 * envío real lo hace el worker (dispatchOutbox), disparado por QStash.
 *
 * No conoce SMTP/Resend/QStash: eso vive detrás del outbox y el transporte.
 */
export async function enqueueEmail({
	to,
	subject,
	html,
	from,
}: EnqueueEmailInput): Promise<{ id: string }> {
	const doc = await EmailOutboxModel.create({
		to,
		subject,
		html,
		from: from ?? ENV.EMAIL_FROM,
		status: 'pending',
		attempts: 0,
		maxAttempts: ENV.EMAIL_OUTBOX_MAX_ATTEMPTS,
	});

	// Solo en desarrollo (no test ni producción): drena en proceso best-effort
	// para que los flujos locales muestren el preview de Ethereal sin montar
	// QStash. En prod lo dispara QStash; en test se drena explícitamente.
	if (ENV.NODE_ENV === 'development') {
		void dispatchPendingEmails().catch((error) =>
			logError(`[email] dev drain failed: ${error}`),
		);
	}

	return { id: doc.id as string };
}
