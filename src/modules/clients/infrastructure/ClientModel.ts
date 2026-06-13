import { model, Schema } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { DOCUMENT_TYPES_ARRAY } from '../constants/documentTypes';
import type { CreateClientInput } from '../schemas/client.schema';

export interface ClientDocument extends Omit<CreateClientInput, 'status'> {
	id: string;
	status: string;
	deletedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const clientSchema = new Schema<ClientDocument>(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		businessName: {
			type: String,
			required: true,
			maxLength: 200,
			minLength: 2,
		},
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
		postalCode: { type: String, maxLength: 20 },
		logoUrl: { type: String },
		website: { type: String },
		email: { type: String },
		phone: { type: String, maxLength: 30 },
		industry: { type: String, maxLength: 100 },
		language: { type: String, maxLength: 10 },
		currency: { type: String, maxLength: 3, uppercase: true },
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
			default: 'active',
			enum: ['active', 'inactive'],
		},
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

clientSchema.index({ businessName: 1 });
clientSchema.index({ status: 1, createdAt: -1 });
clientSchema.index({ country: 1 });

// Uniqueness key for clients: a tax/identity document is unique per country.
// Partial so clients without a document are allowed, and soft-deleted ones do
// not block re-creation. This index is the source of truth for de-duplication.
clientSchema.index(
	{ documentType: 1, documentNumber: 1, country: 1 },
	{
		unique: true,
		partialFilterExpression: {
			documentNumber: { $exists: true },
			deletedAt: null,
		},
	},
);

export default model<ClientDocument>('Client', clientSchema);
