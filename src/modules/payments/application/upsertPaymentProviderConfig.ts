import PaymentProviderConfigModel from '../infrastructure/PaymentProviderConfigModel';
import type { PaymentProviderKey } from '../constants/providerRegistry';
import type { UpdatePaymentProviderConfigInput } from '../schemas/paymentProviderConfig.schema';
import { presentProviderConfig } from './presentProviderConfig';

export async function upsertPaymentProviderConfig(
	provider: PaymentProviderKey,
	input: UpdatePaymentProviderConfigInput,
) {
	const update: Record<string, unknown> = {};
	if (input.enabled !== undefined) update.enabled = input.enabled;
	if (input.isDefault !== undefined) update.isDefault = input.isDefault;
	if (input.config !== undefined) update.config = input.config;

	const doc = await PaymentProviderConfigModel.findOneAndUpdate(
		{ provider },
		{ $set: update, $setOnInsert: { provider } },
		{ new: true, upsert: true },
	).lean();

	return presentProviderConfig(provider, doc);
}
