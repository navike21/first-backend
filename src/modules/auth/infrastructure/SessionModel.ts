import { model, Schema } from 'mongoose';

export interface SessionDocument {
	userId: string;
	userAgent: string;
	ip: string;
	lastSeen: Date;
}

const sessionSchema = new Schema<SessionDocument>(
	{
		userId: { type: String, required: true, index: true },
		userAgent: { type: String, default: '' },
		ip: { type: String, default: '' },
		lastSeen: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

// Auto-eliminar sesiones inactivas después de 7 días
sessionSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 604800 });

export default model<SessionDocument>('Session', sessionSchema);
