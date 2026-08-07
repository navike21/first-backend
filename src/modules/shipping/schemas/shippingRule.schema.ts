import { z } from 'zod';
import { MoneySchema } from '@Shared/schemas/money.schema';

const ShippingZoneSchema = z.object({
	region: z
		.string({
			error: () => 'SHIPPING_ZONE_REGION_INVALID',
		})
		.trim()
		.min(1, { message: 'SHIPPING_ZONE_REGION_REQUIRED' })
		.max(100),
	provinces: z.array(z.string().trim().min(1).max(100)).optional(),
});

const shippingRuleObject = z.object({
	name: z
		.string({
			error: (iss) =>
				iss.input === undefined
					? 'SHIPPING_RULE_NAME_REQUIRED'
					: 'SHIPPING_RULE_NAME_INVALID',
		})
		.trim()
		.min(2, { message: 'SHIPPING_RULE_NAME_MIN_LENGTH' })
		.max(150, { message: 'SHIPPING_RULE_NAME_MAX_LENGTH' }),

	type: z.enum(['flat', 'free_over_threshold', 'by_zone'], {
		error: () => 'SHIPPING_RULE_TYPE_INVALID',
	}),

	// The fee this rule charges — for `free_over_threshold`, this is the fee
	// charged *below* freeOverAmount; for `by_zone`, the flat fee applied to
	// any matching zone (no per-zone pricing in this phase, see plan).
	amount: MoneySchema,

	// Only meaningful (and required) for type='free_over_threshold' — the
	// cart subtotal at or above which shipping becomes free.
	freeOverAmount: MoneySchema.optional(),

	// Only meaningful (and required, non-empty) for type='by_zone'.
	zones: z.array(ShippingZoneSchema).default([]),

	isActive: z.boolean().default(true),
	order: z.coerce.number().int().default(0),
});

type ShippingRuleRefineInput = {
	type?: 'flat' | 'free_over_threshold' | 'by_zone';
	freeOverAmount?: { amount: number; currency: string };
	zones?: { region: string; provinces?: string[] }[];
};

const freeOverAmountRequiredForThreshold = (data: ShippingRuleRefineInput) =>
	data.type !== 'free_over_threshold' || data.freeOverAmount !== undefined;
const freeOverAmountOnlyForThreshold = (data: ShippingRuleRefineInput) =>
	data.type === 'free_over_threshold' || data.freeOverAmount === undefined;
const zonesRequiredForByZone = (data: ShippingRuleRefineInput) =>
	data.type !== 'by_zone' || (data.zones !== undefined && data.zones.length > 0);

export const CreateShippingRuleSchema = shippingRuleObject
	.refine(freeOverAmountRequiredForThreshold, {
		message: 'SHIPPING_RULE_FREE_OVER_AMOUNT_REQUIRED',
		path: ['freeOverAmount'],
	})
	.refine(freeOverAmountOnlyForThreshold, {
		message: 'SHIPPING_RULE_FREE_OVER_AMOUNT_ONLY_FOR_THRESHOLD',
		path: ['freeOverAmount'],
	})
	.refine(zonesRequiredForByZone, {
		message: 'SHIPPING_RULE_ZONES_REQUIRED',
		path: ['zones'],
	});

export const UpdateShippingRuleSchema = shippingRuleObject
	.partial()
	.refine(freeOverAmountRequiredForThreshold, {
		message: 'SHIPPING_RULE_FREE_OVER_AMOUNT_REQUIRED',
		path: ['freeOverAmount'],
	})
	.refine(freeOverAmountOnlyForThreshold, {
		message: 'SHIPPING_RULE_FREE_OVER_AMOUNT_ONLY_FOR_THRESHOLD',
		path: ['freeOverAmount'],
	})
	.refine(zonesRequiredForByZone, {
		message: 'SHIPPING_RULE_ZONES_REQUIRED',
		path: ['zones'],
	});

export const ListShippingRulesQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	isActive: z.coerce.boolean().optional(),
	search: z.string().trim().max(200).optional(),
});

export type CreateShippingRuleInput = z.infer<typeof CreateShippingRuleSchema>;
export type UpdateShippingRuleInput = z.infer<typeof UpdateShippingRuleSchema>;
export type ListShippingRulesQuery = z.infer<typeof ListShippingRulesQuerySchema>;
