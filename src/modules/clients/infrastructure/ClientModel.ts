import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { ACTIVE, STATUS_REGISTER_ARRAY } from '@Constants/statusRegister';
import { DOCUMENT_TYPES_ARRAY } from '../constants/documentTypes';
import type { CreateClientInput } from '../schemas/client.schema';

export interface ClientDocument extends Omit<CreateClientInput, 'status'> {
	id: string;
	status: string;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const clientSchema = new Schema<ClientDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		businessName: { type: String, required: true, maxLength: 200, minLength: 2 },
		clientType: {
			type: String,
			required: true,
			enum: ['person', 'company'],
		},
		documentType: { type: String, enum: DOCUMENT_TYPES_ARRAY },
		documentNumber: { type: String, maxLength: 50 },
		country: { type: String, required: true, maxLength: 2, uppercase: true },
		state: { type: String, maxLength: 100 },
		city: { type: String, maxLength: 100 },
		address: { type: String, maxLength: 300 },
		logoUrl: { type: String },
		website: { type: String },
		industry: { type: String, maxLength: 100 },
		primaryContact: {
			type: {
				firstName: { type: String, required: true },
				lastName: { type: String, required: true },
				email: { type: String, required: true },
				phone: { type: String },
				position: { type: String },
			},
			required: false,
		},
		notes: { type: String, maxLength: 2000 },
		status: {
			type: String,
			required: true,
			default: ACTIVE,
			enum: STATUS_REGISTER_ARRAY,
		},
		deletedAt: { type: Date },
	},
	{ timestamps: true },
);

clientSchema.index({ businessName: 1 });
clientSchema.index({ status: 1, createdAt: -1 });
clientSchema.index({ country: 1 });

export default model<ClientDocument>('Client', clientSchema);
