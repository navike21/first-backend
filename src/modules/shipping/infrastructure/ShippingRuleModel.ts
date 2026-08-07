import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';
import { moneyType } from '@Shared/infrastructure/moneyType';

const ShippingZoneSchema = new Schema(
	{
		region: { type: String, required: true, maxLength: 100 },
		provinces: { type: [String], default: [] },
	},
	{ _id: false },
);

const ShippingRuleSchema = new Schema(
	{
		id: { type: String, required: true, unique: true, default: generateUUID },
		name: { type: String, required: true, maxLength: 150 },
		type: {
			type: String,
			enum: ['flat', 'free_over_threshold', 'by_zone'],
			required: true,
		},
		amount: { type: moneyType, required: true },
		freeOverAmount: { type: moneyType },
		zones: { type: [ShippingZoneSchema], default: [] },
		isActive: { type: Boolean, default: true },
		order: { type: Number, required: true, default: 0 },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

ShippingRuleSchema.index({ isActive: 1, order: 1 });

const ShippingRuleModel = model('ShippingRule', ShippingRuleSchema);
export default ShippingRuleModel;
