import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import ShippingRuleModel from '../infrastructure/ShippingRuleModel';
import { ShippingRuleNotFoundError } from '../domain/errors/ShippingErrors';

export async function getShippingRuleById(id: string) {
	const doc = await ShippingRuleModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new ShippingRuleNotFoundError();
	return cleanMongoFields(doc);
}
