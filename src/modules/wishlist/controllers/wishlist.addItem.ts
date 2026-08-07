import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { validate } from '@Helpers/validate';
import { addWishlistItem } from '../application/addWishlistItem';
import { WishlistProductParamSchema } from '../schemas/wishlist.schema';

export const wishlistAddItemController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const { productId } = validate(WishlistProductParamSchema, req.params);
	const wishlist = await addWishlistItem(customerId, productId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_WISHLIST_ITEM_ADDED',
		message: 'SUCCESS_WISHLIST_ITEM_ADDED',
		ns: 'wishlist',
		data: cleanMongoFields(wishlist.toObject({ versionKey: false })),
	});
});
