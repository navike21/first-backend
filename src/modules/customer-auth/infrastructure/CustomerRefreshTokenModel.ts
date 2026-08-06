import { model, Schema } from 'mongoose';

export interface CustomerRefreshTokenDocument {
	jti: string;
	customerId: string;
	userAgent: string;
	ip: string;
	expiresAt: Date;
	revokedAt?: Date;
	replacedBy?: string;
}

const customerRefreshTokenSchema = new Schema<CustomerRefreshTokenDocument>(
	{
		jti: { type: String, required: true, unique: true },
		customerId: { type: String, required: true, index: true },
		userAgent: { type: String, default: '' },
		ip: { type: String, default: '' },
		expiresAt: { type: Date, required: true },
		revokedAt: { type: Date },
		replacedBy: { type: String },
	},
	{ timestamps: true },
);

// Auto-eliminar tokens expirados.
customerRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<CustomerRefreshTokenDocument>(
	'CustomerRefreshToken',
	customerRefreshTokenSchema,
);
