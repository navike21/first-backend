export interface SendEmailInput {
	from: string;
	to: string;
	subject: string;
	html: string;
}

/**
 * Abstracción del proveedor de envío. Cualquier impl (Resend, SMTP, o un
 * servicio externo a futuro) implementa `send`; el worker (dispatchOutbox) solo
 * conoce esta interfaz, así que cambiar de proveedor no toca la lógica del
 * outbox ni a quien encola. Debe LANZAR si el envío falla — el outbox usa esa
 * excepción para reintentar / mandar a dead-letter.
 */
export interface EmailTransport {
	readonly name: string;
	send(input: SendEmailInput): Promise<void>;
}
