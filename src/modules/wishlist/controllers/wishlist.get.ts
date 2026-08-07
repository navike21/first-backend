import { asyncHandler } from '@Middlewares/asyncHandler';
import { successResponse } from '@Helpers/responseStructure';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { getOrCreateWishlist } from '../application/getOrCreateWishlist';

export const wishlistGetController = asyncHandler(async (req, res) => {
	const customerId = res.locals.customerId as string;
	const wishlist = await getOrCreateWishlist(customerId);
	successResponse(res, {
		statusCode: 200,
		code: 'SUCCESS_WISHLIST_FETCHED',
		message: 'SUCCESS_WISHLIST_FETCHED',
		ns: 'wishlist',
		data: cleanMongoFields(wishlist.toObject({ versionKey: false })),
	});
});
