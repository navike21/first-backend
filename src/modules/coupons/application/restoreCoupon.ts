import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { AppError } from '@Shared/domain/AppError';
import CouponModel from '../infrastructure/CouponModel';

export async function restoreCoupon(id: string) {
	const doc = await CouponModel.findOne({
		id,
		deletedAt: { $ne: null },
	}).lean();
	if (!doc) AppError.notFound('COUPON_NOT_FOUND', 'Coupon not found in trash');

	await CouponModel.findOneAndUpdate(
		{ id, deletedAt: { $ne: null } },
		{ $unset: { deletedAt: '' } },
	);
	return cleanMongoFields({ ...doc, deletedAt: undefined });
}
