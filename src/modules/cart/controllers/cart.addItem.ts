import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { validate } from '@Helpers/validate';
import { addCartItem } from '../application/addCartItem';
import { AddCartItemSchema } from '../schemas/cart.schema';

export const cartAddItemController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const validated = validate(AddCartItemSchema, req.body);
	const cart = await addCartItem(customerId, validated);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_CART_ITEM_ADDED',
		message: 'SUCCESS_CART_ITEM_ADDED',
		ns: 'cart',
		data: cleanMongoFields(cart.toObject({ versionKey: false })),
	});
});
