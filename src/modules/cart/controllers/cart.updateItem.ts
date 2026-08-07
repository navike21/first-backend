import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { validate } from '@Helpers/validate';
import { updateCartItemQuantity } from '../application/updateCartItemQuantity';
import { UpdateCartItemQuantitySchema } from '../schemas/cart.schema';

export const cartUpdateItemController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const productId = String(req.params.productId);
	const validated = validate(UpdateCartItemQuantitySchema, req.body);
	const cart = await updateCartItemQuantity(customerId, productId, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CART_ITEM_UPDATED',
		message: 'SUCCESS_CART_ITEM_UPDATED',
		ns: 'cart',
		data: cleanMongoFields(cart.toObject({ versionKey: false })),
	});
});
