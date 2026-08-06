// Mirrors `moneyType.ts`/`localizedStringType.ts` — a plain field-definition
// object embedded with `{ type: addressType, ... }` in a parent schema. Same
// geo shape as `ClientModel`'s address fields.
export const addressType = {
	country: { type: String, maxLength: 2, uppercase: true, default: '' },
	ubigeoCode: { type: String, maxLength: 12, default: '' },
	region: { type: String, maxLength: 100, default: '' },
	province: { type: String, maxLength: 100, default: '' },
	district: { type: String, maxLength: 100, default: '' },
	address: { type: String, maxLength: 300, default: '' },
	addressNumber: { type: String, maxLength: 30, default: '' },
	addressInterior: { type: String, maxLength: 60, default: '' },
} as const;

export interface AddressDocument {
	country: string;
	ubigeoCode: string;
	region: string;
	province: string;
	district: string;
	address: string;
	addressNumber: string;
	addressInterior: string;
}
