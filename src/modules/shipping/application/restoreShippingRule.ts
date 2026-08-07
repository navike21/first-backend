import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import ShippingRuleModel from '../infrastructure/ShippingRuleModel';

export async function restoreShippingRule(id: string) {
	const doc = await ShippingRuleModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc)
		AppError.notFound('SHIPPING_RULE_NOT_FOUND', 'Shipping rule not found in trash');

	await ShippingRuleModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
