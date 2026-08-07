import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { validate } from '@Helpers/validate';
import { listShippingRules } from '../application/listShippingRules';
import { ListShippingRulesQuerySchema } from '../schemas/shippingRule.schema';

export const shippingRuleListController = asyncHandler(async (req, res) => {
	const query = validate(ListShippingRulesQuerySchema, req.query);
	const { data, meta } = await listShippingRules(query);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_SHIPPING_RULE_LIST',
		message: 'SUCCESS_SHIPPING_RULE_LIST',
		ns: 'shipping',
		data,
		meta,
	});
});
