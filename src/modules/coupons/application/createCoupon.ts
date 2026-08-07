import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import CouponModel from '../infrastructure/CouponModel';
import { assertCouponCodeUnique } from './assertCouponCodeUnique';
import type { CreateCouponInput } from '../schemas/coupon.schema';

export async function createCoupon(input: CreateCouponInput) {
	await assertCouponCodeUnique(input.code);

	const doc = await CouponModel.create(input);
	return cleanMongoFields(doc.toObject());
}
