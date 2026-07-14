import { Schema, model } from 'mongoose';
import generateUUID from '@Helpers/uuid';

// Separate collection tied to its parent Form by `formId` — same precedent
// as PageRevisionModel. `data` is Schema.Types.Mixed: the DB-layer
// counterpart to the dynamically-built Zod schema in buildSubmissionSchema.ts
// (fields are admin-defined, so there's no static shape to declare here).
const FormSubmissionSchema = new Schema(
	{
		id: { type: String, default: generateUUID, index: true },
		formId: { type: String, required: true, index: true },
		data: { type: Schema.Types.Mixed, required: true },
		isRead: { type: Boolean, default: false },
		ipAddress: { type: String },
		userAgent: { type: String },
		deletedAt: { type: Date, default: null },
	},
	{ timestamps: true },
);

FormSubmissionSchema.index({ formId: 1, createdAt: -1 });
FormSubmissionSchema.index({ formId: 1, isRead: 1 });

const FormSubmissionModel = model('FormSubmission', FormSubmissionSchema);
export default FormSubmissionModel;
