import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CouponModel from '../infrastructure/CouponModel';
import { CouponNotFoundError } from '../domain/errors/CouponErrors';
import { assertCouponCodeUnique } from './assertCouponCodeUnique';
import type { UpdateCouponInput } from '../schemas/coupon.schema';

export async function updateCoupon(id: string, input: UpdateCouponInput) {
	const doc = await CouponModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CouponNotFoundError();

	if (input.code !== undefined) {
		await assertCouponCodeUnique(input.code, id);
	}

	Object.assign(doc, input);
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
