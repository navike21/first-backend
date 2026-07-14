import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { validate } from '@Helpers/validate';
import { eventBus } from '@Shared/infrastructure/EventBus';
import { FormSubmissionReceivedEvent } from '@Shared/events/emailEvents';
import FormModel from '../infrastructure/FormModel';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';
import { FormInactiveError } from '../domain/errors/FormErrors';
import { buildSubmissionSchema } from '../schemas/buildSubmissionSchema';
import type { FormFieldConfig } from '../schemas/form.schema';

interface SubmitFormOptions {
	ipAddress?: string;
	userAgent?: string;
	lang?: string;
}

function resolveLocalized(value: Record<string, string>, lang: string): string {
	return value[lang] || value.en || Object.values(value).find(Boolean) || '';
}

export async function submitForm(
	formId: string,
	rawBody: unknown,
	{ ipAddress, userAgent, lang = 'en' }: SubmitFormOptions = {},
) {
	// Re-fetches the form's CURRENT fields on every submission (not cached) —
	// buildSubmissionSchema must always validate against what the form asks
	// for right now, not a stale copy.
	const form = await FormModel.findOne({
		id: formId,
		deletedAt: null,
		status: 'active',
	}).lean();
	if (!form) throw new FormInactiveError();

	const fields = form.fields as unknown as FormFieldConfig[];
	const schema = buildSubmissionSchema(fields);
	const data = validate(schema, rawBody) as Record<string, unknown>;

	const doc = await FormSubmissionModel.create({
		formId,
		data,
		ipAddress,
		userAgent,
	});

	if (form.notificationEmails.length > 0) {
		const summary: Record<string, string> = {};
		for (const field of fields) {
			const label = resolveLocalized(field.label, lang) || field.fieldId || '';
			const value = data[field.fieldId as string];
			summary[label] =
				value === undefined || value === null ? '' : String(value);
		}

		// Fire-and-forget from the caller's perspective: registerEmailSubscribers'
		// handler wraps the actual send in dispatch()/.catch, so this publish
		// never blocks the HTTP response on SMTP latency/failures.
		await eventBus.publish(
			new FormSubmissionReceivedEvent(
				form.notificationEmails,
				resolveLocalized(form.title as Record<string, string>, lang),
				summary,
				lang,
			),
		);
	}

	return cleanMongoFields(doc.toObject());
}
