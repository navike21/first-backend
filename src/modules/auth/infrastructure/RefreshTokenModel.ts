import { model, Schema } from 'mongoose';

export interface RefreshTokenDocument {
	jti: string;
	userId: string;
	userAgent: string;
	ip: string;
	expiresAt: Date;
	revokedAt?: Date;
	replacedBy?: string;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
	{
		jti: { type: String, required: true, unique: true },
		userId: { type: String, required: true, index: true },
		userAgent: { type: String, default: '' },
		ip: { type: String, default: '' },
		expiresAt: { type: Date, required: true },
		revokedAt: { type: Date },
		replacedBy: { type: String },
	},
	{ timestamps: true },
);

// Auto-eliminar tokens expirados
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
