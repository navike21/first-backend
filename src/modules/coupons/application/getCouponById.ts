import CouponModel from '../infrastructure/CouponModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CouponNotFoundError } from '../domain/errors/CouponErrors';

export async function getCouponById(id: string) {
	const doc = await CouponModel.findOne({ id, deletedAt: null }).lean();
	if (!doc) throw new CouponNotFoundError();
	return cleanMongoFields(doc);
}
