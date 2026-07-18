import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';

export const EMAIL_OUTBOX_STATUS = [
	'pending',
	'sending',
	'sent',
	'failed',
] as const;

export type EmailOutboxStatus = (typeof EMAIL_OUTBOX_STATUS)[number];

// Colección separada (mismo precedente que FormSubmissionModel / PageRevision):
// es la fuente de verdad durable del envío. Un correo se persiste como `pending`
// y el worker (dispatchOutbox) lo reclama, envía y marca. `lockedAt` es el lease
// del reclamo atómico — permite recuperar filas atascadas en `sending` de una
// invocación serverless que murió a mitad de envío.
const EmailOutboxSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		to: { type: String, required: true },
		from: { type: String },
		subject: { type: String, required: true },
		html: { type: String, required: true },
		status: {
			type: String,
			enum: EMAIL_OUTBOX_STATUS,
			default: 'pending',
			required: true,
		},
		attempts: { type: Number, default: 0 },
		maxAttempts: { type: Number, required: true },
		lastError: { type: String },
		lockedAt: { type: Date, default: null },
		sentAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

// Query del drenado: los pendientes más viejos primero. Incluye `lockedAt` para
// el barrido de filas con lease vencido.
EmailOutboxSchema.index({ status: 1, lockedAt: 1, createdAt: 1 });

const EmailOutboxModel = model('EmailOutbox', EmailOutboxSchema);
export default EmailOutboxModel;
