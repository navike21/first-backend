import { z } from 'zod';
import type { FormFieldConfig } from './form.schema';

/**
 * Every other module validates a hand-written, static Zod schema. Here the
 * fields are admin-authored DATA, not code, so the submission schema is built
 * at request time from the form's own field list. Keyed by `fieldId` (never
 * by label — labels are `LocalizedString` and mutable, unusable as identity).
 * `.strict()` rejects keys for fields that don't exist on this form — a
 * second line of defense beyond the rate limiter against payload smuggling.
 */
export function buildSubmissionSchema(
	fields: FormFieldConfig[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
	const shape: Record<string, z.ZodTypeAny> = {};

	for (const field of fields) {
		let base: z.ZodTypeAny;

		switch (field.type) {
			case 'email':
				base = z.email({ message: 'FORM_SUBMISSION_FIELD_INVALID' });
				break;
			case 'checkbox':
				base = z.boolean({ message: 'FORM_SUBMISSION_FIELD_INVALID' });
				break;
			case 'date':
				base = z.iso.date({ message: 'FORM_SUBMISSION_FIELD_INVALID' });
				break;
			case 'select':
			case 'radio': {
				const values = (field.options ?? []).map((option) => option.value);
				base =
					values.length > 0
						? z.enum(values as [string, ...string[]], {
								message: 'FORM_SUBMISSION_FIELD_INVALID',
							})
						: z.string();
				break;
			}
			case 'phone':
				base = z
					.string()
					.trim()
					.max(field.maxLength ?? 20);
				break;
			case 'textarea':
				base = z
					.string()
					.trim()
					.max(field.maxLength ?? 5000);
				break;
			case 'text':
			default:
				base = z
					.string()
					.trim()
					.max(field.maxLength ?? 200);
		}

		if (!field.required) {
			base =
				field.type === 'checkbox'
					? base.optional().default(false)
					: base.optional();
		}

		// fieldId is always assigned server-side before a form is persisted
		// (see createForm/updateForm) — safe to assert here.
		shape[field.fieldId as string] = base;
	}

	return z.object(shape).strict();
}
