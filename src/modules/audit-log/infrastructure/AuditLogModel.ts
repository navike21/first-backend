import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';

export interface AuditLogDocument {
	id: string;
	userId?: string;
	action: string;
	resource: string;
	resourceId?: string;
	metadata?: Record<string, unknown>;
	ipAddress?: string;
	userAgent?: string;
	occurredAt: Date;
	user?: {
		firstName: string;
		lastName: string;
		email: string;
	};
}

const auditLogSchema = new Schema<AuditLogDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		userId: { type: String },
		action: { type: String, required: true },
		resource: { type: String, required: true },
		resourceId: { type: String },
		metadata: { type: Schema.Types.Mixed },
		ipAddress: { type: String },
		userAgent: { type: String },
		user: {
			firstName: { type: String },
			lastName: { type: String },
			email: { type: String },
		},
		occurredAt: { type: Date, required: true, default: Date.now },
	},
	{ timestamps: false },
);

auditLogSchema.index({ userId: 1, occurredAt: -1 });
auditLogSchema.index({ resource: 1, occurredAt: -1 });
auditLogSchema.index({ action: 1, occurredAt: -1 });
auditLogSchema.index({ occurredAt: -1 });

export default model<AuditLogDocument>('AuditLog', auditLogSchema);
