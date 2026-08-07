import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { validate } from '@Helpers/validate';
import { removeCartItem } from '../application/removeCartItem';
import { RemoveCartItemSchema } from '../schemas/cart.schema';

export const cartRemoveItemController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const productId = String(req.params.productId);
	const validated = validate(RemoveCartItemSchema, req.body ?? {});
	const cart = await removeCartItem(customerId, productId, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CART_ITEM_REMOVED',
		message: 'SUCCESS_CART_ITEM_REMOVED',
		ns: 'cart',
		data: cleanMongoFields(cart.toObject({ versionKey: false })),
	});
});
