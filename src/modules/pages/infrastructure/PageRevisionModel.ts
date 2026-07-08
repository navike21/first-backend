import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';

const PageRevisionSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		pageId: { type: String, required: true, index: true },
		snapshot: { type: Schema.Types.Mixed, required: true },
		createdBy: { type: String },
		createdAt: { type: Date, default: Date.now },
	},
	{ timestamps: false },
);

PageRevisionSchema.index({ pageId: 1, createdAt: -1 });

const PageRevisionModel = model('PageRevision', PageRevisionSchema);
export default PageRevisionModel;
