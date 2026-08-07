import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ShippingRuleModel from '../infrastructure/ShippingRuleModel';
import type { CreateShippingRuleInput } from '../schemas/shippingRule.schema';

export async function createShippingRule(input: CreateShippingRuleInput) {
	const doc = await ShippingRuleModel.create(input);
	return cleanMongoFields(doc.toObject());
}
