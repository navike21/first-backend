import { model, Schema } from 'mongoose';

// Own collection, never shared with staff `Session` — same shape/TTL
// precedent, but a leaked customer session must never resolve against the
// staff realm (or vice versa).
export interface CustomerSessionDocument {
	customerId: string;
	userAgent: string;
	ip: string;
	lastSeen: Date;
}

const customerSessionSchema = new Schema<CustomerSessionDocument>(
	{
		customerId: { type: String, required: true, index: true },
		userAgent: { type: String, default: '' },
		ip: { type: String, default: '' },
		lastSeen: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

// Auto-eliminar sesiones inactivas después de 7 días (mismo TTL que staff).
customerSessionSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 604800 });

export default model<CustomerSessionDocument>(
	'CustomerSession',
	customerSessionSchema,
);
