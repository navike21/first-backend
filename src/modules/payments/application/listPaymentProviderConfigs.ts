import PaymentProviderConfigModel from '../infrastructure/PaymentProviderConfigModel';
import { PAYMENT_PROVIDER_KEYS } from '../constants/providerRegistry';
import { presentProviderConfig } from './presentProviderConfig';

export async function listPaymentProviderConfigs() {
	const saved = await PaymentProviderConfigModel.find({}).lean();
	const savedByProvider = new Map(saved.map((doc) => [doc.provider, doc]));

	return PAYMENT_PROVIDER_KEYS.map((provider) =>
		presentProviderConfig(provider, savedByProvider.get(provider) ?? null),
	);
}
