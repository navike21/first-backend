import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { createShippingRule } from '../application/createShippingRule';
import { CreateShippingRuleSchema } from '../schemas/shippingRule.schema';

export const shippingRuleCreateController = asyncHandler(async (req, res) => {
	const validated = validate(CreateShippingRuleSchema, req.body);

	const data = await createShippingRule(validated);
	successResponse(res, {
		statusCode: 201,
		code: 'SUCCESS_SHIPPING_RULE_CREATE',
		message: 'SUCCESS_SHIPPING_RULE_CREATE',
		ns: 'shipping',
		data,
	});
});
