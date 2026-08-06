import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { addressType } from '@Shared/infrastructure/addressType';

const LocationSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		name: { type: String, required: true, maxLength: 150 },
		type: { type: String, enum: ['warehouse', 'store'], required: true },
		address: { type: addressType, default: () => ({}) },
		// Whether this location's stock counts toward what a future public
		// storefront can fulfill online (vs. a store-only location that only
		// serves walk-in customers).
		fulfillsOnline: { type: Boolean, default: true },
		isActive: { type: Boolean, default: true },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

LocationSchema.index({ isActive: 1, createdAt: -1 });

const LocationModel = model('Location', LocationSchema);
export default LocationModel;
