import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { restoreShippingRule } from '../application/restoreShippingRule';

export const shippingRuleRestoreController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await restoreShippingRule(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SHIPPING_RULE_RESTORED',
		message: 'SUCCESS_SHIPPING_RULE_RESTORED',
		ns: 'shipping',
		data,
	});
});
