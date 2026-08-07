import CouponModel from '../infrastructure/CouponModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { CouponNotFoundError } from '../domain/errors/CouponErrors';

export async function deleteCouponLogical(id: string) {
	const doc = await CouponModel.findOne({ id, deletedAt: null });
	if (!doc) throw new CouponNotFoundError();

	doc.deletedAt = new Date();
	await doc.save();
	return cleanMongoFields(doc.toObject());
}
