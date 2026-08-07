import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { listDeletedShippingRules } from '../application/listDeletedShippingRules';

export const shippingRuleTrashController = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 20;
	const { data, meta } = await listDeletedShippingRules({ page, limit });
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SHIPPING_RULE_TRASH_LIST',
		message: 'SUCCESS_SHIPPING_RULE_TRASH_LIST',
		ns: 'shipping',
		data,
		meta,
	});
});
