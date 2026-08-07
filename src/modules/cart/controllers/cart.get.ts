import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { getOrCreateCart } from '../application/getOrCreateCart';

export const cartGetController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const cart = await getOrCreateCart(customerId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CART_FETCHED',
		message: 'SUCCESS_CART_FETCHED',
		ns: 'cart',
		data: cleanMongoFields(cart.toObject({ versionKey: false })),
	});
});
