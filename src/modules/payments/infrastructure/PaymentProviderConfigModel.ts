import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { PAYMENT_PROVIDER_KEYS } from '../constants/providerRegistry';

const PaymentProviderConfigSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		provider: {
			type: String,
			enum: PAYMENT_PROVIDER_KEYS as unknown as string[],
			required: true,
		},
		enabled: { type: Boolean, default: false },
		isDefault: { type: Boolean, default: false },
		config: { type: Schema.Types.Mixed, default: {} },
	},
	{ timestamps: true },
);

// One row per provider — not soft-deletable/trashable, the provider set is
// fixed by the registry (see providerRegistry.ts), so there's nothing to
// "create" or "permanently destroy", only enable/configure/disable.
PaymentProviderConfigSchema.index({ provider: 1 }, { unique: true });

const PaymentProviderConfigModel = model('PaymentProviderConfig', PaymentProviderConfigSchema);
export default PaymentProviderConfigModel;
