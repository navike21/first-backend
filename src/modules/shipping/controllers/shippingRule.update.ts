import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { updateShippingRule } from '../application/updateShippingRule';
import { UpdateShippingRuleSchema } from '../schemas/shippingRule.schema';

export const shippingRuleUpdateController = asyncHandler(async (req, res) => {
	const id = String(req.params.id);
	const validated = validate(UpdateShippingRuleSchema, req.body);

	const data = await updateShippingRule(id, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SHIPPING_RULE_UPDATE',
		message: 'SUCCESS_SHIPPING_RULE_UPDATE',
		ns: 'shipping',
		data,
	});
});
