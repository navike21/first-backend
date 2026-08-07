import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { PAYMENT_PROVIDER_REGISTRY, type PaymentProviderKey } from '../constants/providerRegistry';

export interface PaymentProviderConfigView {
	provider: PaymentProviderKey;
	label: string;
	fields: { key: string; label: string; type: 'text' | 'password'; required: boolean }[];
	enabled: boolean;
	isDefault: boolean;
	config: Record<string, string>;
}

/**
 * Secret (`type: 'password'`) fields are write-only — accepted on update,
 * never echoed back here — same criterion as any credential in this
 * codebase. Non-secret fields are returned as-is so the admin can see what's
 * already configured. `doc` is `null` for a provider that has never been
 * saved — presented with its defaults (disabled, empty config), same
 * merge-with-defaults spirit as `ecommerce-settings`.
 */
export function presentProviderConfig(
	provider: PaymentProviderKey,
	doc: { enabled?: boolean; isDefault?: boolean; config?: unknown } | null,
): PaymentProviderConfigView {
	const definition = PAYMENT_PROVIDER_REGISTRY[provider];
	const secretKeys = new Set(
		definition.fields.filter((field) => field.type === 'password').map((field) => field.key),
	);
	const rawConfig = cleanMongoFields((doc?.config as Record<string, string>) ?? {});
	const config: Record<string, string> = {};
	for (const [key, value] of Object.entries(rawConfig)) {
		if (secretKeys.has(key)) continue;
		config[key] = value;
	}

	return {
		provider,
		label: definition.label,
		fields: definition.fields,
		enabled: doc?.enabled ?? false,
		isDefault: doc?.isDefault ?? false,
		config,
	};
}
