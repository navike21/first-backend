import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { deleteShippingRulePhysical } from '../application/deleteShippingRulePhysical';

export const shippingRuleDeletePermanentController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await deleteShippingRulePhysical(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SHIPPING_RULE_PURGED',
		message: 'SUCCESS_SHIPPING_RULE_PURGED',
		ns: 'shipping',
		data,
	});
});
