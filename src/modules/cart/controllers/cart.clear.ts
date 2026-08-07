import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { clearCart } from '../application/clearCart';

export const cartClearController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const cart = await clearCart(customerId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CART_CLEARED',
		message: 'SUCCESS_CART_CLEARED',
		ns: 'cart',
		data: cleanMongoFields(cart.toObject({ versionKey: false })),
	});
});
