import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import type { Address } from '@Shared/schemas/address.schema';
import type { Money } from '@Shared/schemas/money.schema';
import ShippingRuleModel from '../infrastructure/ShippingRuleModel';
import { ShippingNotAvailableError } from '../domain/errors/ShippingErrors';

export interface CalculateShippingCostInput {
	address: Address;
	cartSubtotal: Money;
}

export interface CalculateShippingCostResult {
	shippingRuleId: string;
	shippingCost: Money;
}

function zoneMatches(
	zones: { region: string; provinces?: string[] }[],
	address: Address,
): boolean {
	if (!address.region) return false;
	return zones.some((zone) => {
		if (zone.region !== address.region) return false;
		if (!zone.provinces || zone.provinces.length === 0) return true;
		return address.province !== undefined && zone.provinces.includes(address.province);
	});
}

/**
 * Walks active shipping rules in `order` and returns the cost from the first
 * one that applies — `flat`/`free_over_threshold` always apply, `by_zone`
 * only if the address' region (and, if listed, province) matches one of the
 * rule's zones. Exported for `orders` (Milestone E) to call at
 * order-creation time, the only intended caller.
 */
export async function calculateShippingCost(
	input: CalculateShippingCostInput,
): Promise<CalculateShippingCostResult> {
	const rules = await ShippingRuleModel.find({ isActive: true, deletedAt: null })
		.sort({ order: 1 })
		.lean();

	for (const rule of rules) {
		if (rule.type === 'flat') {
			return { shippingRuleId: rule.id, shippingCost: cleanMongoFields(rule.amount) };
		}
		if (rule.type === 'free_over_threshold') {
			if (rule.freeOverAmount && input.cartSubtotal.amount >= rule.freeOverAmount.amount) {
				return {
					shippingRuleId: rule.id,
					shippingCost: { amount: 0, currency: rule.amount.currency },
				};
			}
			return { shippingRuleId: rule.id, shippingCost: cleanMongoFields(rule.amount) };
		}
		if (rule.type === 'by_zone' && zoneMatches(rule.zones ?? [], input.address)) {
			return { shippingRuleId: rule.id, shippingCost: cleanMongoFields(rule.amount) };
		}
	}

	throw new ShippingNotAvailableError();
}
