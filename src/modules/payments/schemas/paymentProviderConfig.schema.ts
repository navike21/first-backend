import { z } from 'zod';
import {
	PAYMENT_PROVIDER_KEYS,
	PAYMENT_PROVIDER_REGISTRY,
	type PaymentProviderKey,
} from '../constants/providerRegistry';

// Each provider's `config` shape is generated from its own field list in the
// registry (key/required) rather than hand-written per provider — the field
// list IS the schema (same spirit as `forms`' buildSubmissionSchema, applied
// to the provider registry instead of an admin-authored form).
function buildConfigSchema(provider: PaymentProviderKey): z.ZodType<Record<string, string>> {
	const shape: Record<string, z.ZodTypeAny> = {};
	for (const field of PAYMENT_PROVIDER_REGISTRY[provider].fields) {
		const base = z.string().trim().max(500);
		shape[field.key] = field.required
			? base.min(1, { message: 'PAYMENT_PROVIDER_CONFIG_FIELD_REQUIRED' })
			: base.optional();
	}
	return z.object(shape).strict() as unknown as z.ZodType<Record<string, string>>;
}

const CONFIG_SCHEMA_BY_PROVIDER = Object.fromEntries(
	PAYMENT_PROVIDER_KEYS.map((provider) => [provider, buildConfigSchema(provider)]),
) as Record<PaymentProviderKey, ReturnType<typeof buildConfigSchema>>;

/**
 * `config`'s shape is provider-specific, so — like translation-assist's
 * `requestSchemaFor(domain)` — the update schema is built per-provider
 * rather than being one static object. `config`, when provided, fully
 * replaces the stored config (no partial-merge at the schema layer), so it
 * must satisfy every required field for that provider in one call.
 */
export function updatePaymentProviderConfigSchemaFor(provider: PaymentProviderKey) {
	return z
		.object({
			enabled: z.boolean().optional(),
			isDefault: z.boolean().optional(),
			config: CONFIG_SCHEMA_BY_PROVIDER[provider].optional(),
		})
		.refine(
			(data) =>
				data.enabled !== undefined ||
				data.isDefault !== undefined ||
				data.config !== undefined,
			{ message: 'PAYMENT_PROVIDER_CONFIG_EMPTY_UPDATE' },
		);
}

export type UpdatePaymentProviderConfigInput = {
	enabled?: boolean;
	isDefault?: boolean;
	config?: Record<string, string>;
};
