import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ShippingRuleModel from '../infrastructure/ShippingRuleModel';
import { ShippingRuleNotFoundError } from '../domain/errors/ShippingErrors';
import type { UpdateShippingRuleInput } from '../schemas/shippingRule.schema';

export async function updateShippingRule(
	id: string,
	input: UpdateShippingRuleInput,
) {
	const doc = await ShippingRuleModel.findOne({ id, deletedAt: null });
	if (!doc) throw new ShippingRuleNotFoundError();

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
