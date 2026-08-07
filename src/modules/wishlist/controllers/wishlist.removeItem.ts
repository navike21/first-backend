import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { validate } from '@Helpers/validate';
import { removeWishlistItem } from '../application/removeWishlistItem';
import { WishlistProductParamSchema } from '../schemas/wishlist.schema';

export const wishlistRemoveItemController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const { productId } = validate(WishlistProductParamSchema, req.params);
	const wishlist = await removeWishlistItem(customerId, productId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_WISHLIST_ITEM_REMOVED',
		message: 'SUCCESS_WISHLIST_ITEM_REMOVED',
		ns: 'wishlist',
		data: cleanMongoFields(wishlist.toObject({ versionKey: false })),
	});
});
