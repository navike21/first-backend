import generateUUID from '@Helpers/uuid';
import type { FormFieldConfig } from '../schemas/form.schema';

// New fields from the editor arrive without a `fieldId` (existing fields
// keep the one they already have) — assign one server-side before persisting,
// since buildSubmissionSchema keys the submission shape by `fieldId`.
export function assignFieldIds(fields: FormFieldConfig[]): FormFieldConfig[] {
	return fields.map((field) => ({
		...field,
		fieldId: field.fieldId ?? generateUUID(),
	}));
}
