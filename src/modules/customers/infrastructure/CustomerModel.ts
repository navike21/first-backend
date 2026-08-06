import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { addressType } from '@Shared/infrastructure/addressType';
import { DOCUMENT_TYPES_ARRAY } from '../constants/documentTypes';

const CustomerAddressSchema = new Schema(
	{
		addressId: { type: String, required: true, default: generateUUID },
		type: { type: String, enum: ['shipping', 'billing'], required: true },
		isDefault: { type: Boolean, default: false },
		...addressType,
	},
	{ _id: false },
);

const CustomerSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		firstName: { type: String, required: true, maxLength: 100 },
		lastName: { type: String, required: true, maxLength: 100 },
		email: { type: String, required: true, lowercase: true, trim: true },
		phone: { type: String, maxLength: 30 },
		documentType: { type: String, enum: DOCUMENT_TYPES_ARRAY },
		documentNumber: { type: String, maxLength: 50 },
		addresses: { type: [CustomerAddressSchema], default: [] },
		notes: { type: String, maxLength: 2000 },
		status: {
			type: String,
			required: true,
			default: 'active',
			enum: ['active', 'inactive'],
		},
		// Owned/written by the `customer-auth` module (mirrors the auth/users
		// split for staff) — never set directly from this module's own CRUD.
		passwordHash: { type: String, select: false },
		emailVerified: { type: Boolean, default: false },
		passwordChangedAt: { type: Date },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

CustomerSchema.index({ status: 1, createdAt: -1 });

// A customer's email is their login identity (customer-auth) — unique per
// non-deleted record, same partial-index precedent as everywhere else in
// this codebase (a trashed customer frees the email for reuse).
CustomerSchema.index(
	{ email: 1 },
	{ unique: true, partialFilterExpression: { deletedAt: null } },
);

const CustomerModel = model('Customer', CustomerSchema);
export default CustomerModel;
