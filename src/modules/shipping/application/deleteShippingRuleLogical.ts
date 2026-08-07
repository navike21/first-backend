import ShippingRuleModel from '../infrastructure/ShippingRuleModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { ShippingRuleNotFoundError } from '../domain/errors/ShippingErrors';

export async function deleteShippingRuleLogical(id: string) {
	const doc = await ShippingRuleModel.findOne({ id, deletedAt: null });
	if (!doc) throw new ShippingRuleNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
