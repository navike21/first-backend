import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteShippingRuleLogical } from '../application/deleteShippingRuleLogical';

export const shippingRuleDeleteController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteShippingRuleLogical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SHIPPING_RULE_DELETED',
		message: 'SUCCESS_SHIPPING_RULE_DELETED',
		ns: 'shipping',
		data,
	});
});
