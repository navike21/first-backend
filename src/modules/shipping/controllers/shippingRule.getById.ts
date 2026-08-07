import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { getShippingRuleById } from '../application/getShippingRuleById';

export const shippingRuleGetByIdController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const data = await getShippingRuleById(id);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SHIPPING_RULE_FOUND',
		message: 'SUCCESS_SHIPPING_RULE_FOUND',
		ns: 'shipping',
		data,
	});
});
