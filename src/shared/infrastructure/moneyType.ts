// Mirrors `localizedStringType.ts` — a plain field-definition object embedded
// with `{ type: moneyType, ... }` in a parent schema, not its own sub-schema
// with `_id`. `amount` is integer minor units (cents); see `money.schema.ts`.
export const moneyType = {
	amount: { type: Number, required: true, default: 0 },
	currency: { type: String, required: true, uppercase: true },
} as const;

export interface MoneyDocument {
	amount: number;
	currency: string;
}
