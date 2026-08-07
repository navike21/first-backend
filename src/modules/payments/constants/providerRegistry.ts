export const PAYMENT_PROVIDER_KEYS = ['culqi', 'mercadopago', 'stripe', 'manual'] as const;

export type PaymentProviderKey = (typeof PAYMENT_PROVIDER_KEYS)[number];

export interface PaymentProviderFieldDescriptor {
	key: string;
	label: string;
	// `password` fields are write-only — accepted on update, never echoed back
	// in a GET (see `presentProviderConfig`), same criterion as any credential
	// in this codebase.
	type: 'text' | 'password';
	required: boolean;
}

export interface PaymentProviderDefinition {
	label: string;
	fields: PaymentProviderFieldDescriptor[];
}

/**
 * Static registry of known payment providers and the config fields each one
 * needs — same spirit as `translation-assist`'s per-domain field maps: the
 * field list IS the schema (see `schemas/paymentProviderConfig.schema.ts`,
 * which builds a Zod object from this at module-load time), so adding a
 * provider never means writing a new hand-rolled validator. No provider is
 * actually connected yet (see plan) — this only makes configuring one
 * self-descriptive ahead of the first real driver.
 */
export const PAYMENT_PROVIDER_REGISTRY: Record<PaymentProviderKey, PaymentProviderDefinition> = {
	culqi: {
		label: 'Culqi',
		fields: [
			{ key: 'publicKey', label: 'Public key', type: 'text', required: true },
			{ key: 'secretKey', label: 'Secret key', type: 'password', required: true },
		],
	},
	mercadopago: {
		label: 'MercadoPago',
		fields: [
			{ key: 'publicKey', label: 'Public key', type: 'text', required: true },
			{ key: 'accessToken', label: 'Access token', type: 'password', required: true },
		],
	},
	stripe: {
		label: 'Stripe',
		fields: [
			{ key: 'publishableKey', label: 'Publishable key', type: 'text', required: true },
			{ key: 'secretKey', label: 'Secret key', type: 'password', required: true },
		],
	},
	manual: {
		label: 'Manual / Bank transfer',
		fields: [],
	},
};

export function isKnownPaymentProvider(value: string): value is PaymentProviderKey {
	return (PAYMENT_PROVIDER_KEYS as readonly string[]).includes(value);
}
