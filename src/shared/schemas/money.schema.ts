import { z } from 'zod';

// `amount` is stored in integer minor units (cents) to avoid floating-point
// rounding errors — never a decimal. `currency` is a fixed ISO 4217 code; this
// codebase deliberately supports a single store currency (see
// docs/plan "Fase 1: Catálogo + Gestión Admin + Autoservicio"), so no
// conversion logic lives here.
export const MoneySchema = z.object({
	amount: z.number().int().min(0, { message: 'MONEY_AMOUNT_INVALID' }),
	currency: z
		.string()
		.trim()
		.length(3, { message: 'MONEY_CURRENCY_INVALID' })
		.toUpperCase(),
});

export type Money = z.infer<typeof MoneySchema>;
