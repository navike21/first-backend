import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { PAYMENT_PROVIDER_KEYS } from '../constants/providerRegistry';

const PaymentMethodSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		customerId: { type: String, required: true },
		provider: {
			type: String,
			enum: PAYMENT_PROVIDER_KEYS as unknown as string[],
			required: true,
		},
		providerToken: { type: String, required: true, maxLength: 500 },
		brand: { type: String, required: true, maxLength: 50 },
		last4: { type: String, required: true, maxLength: 4 },
		expiryMonth: { type: Number, required: true },
		expiryYear: { type: Number, required: true },
		isDefault: { type: Boolean, default: false },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

PaymentMethodSchema.index({ customerId: 1, createdAt: -1 });

const PaymentMethodModel = model('PaymentMethod', PaymentMethodSchema);
export default PaymentMethodModel;
