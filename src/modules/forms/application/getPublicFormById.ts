import FormModel from '../infrastructure/FormModel';
import { cleanMongoFields } from '@Helpers/cleanMongoFields';
import { FormInactiveError } from '../domain/errors/FormErrors';

// Public projection — never exposes notificationEmails. 404s (not a
// distinguishable error) when the form is missing, soft-deleted, or inactive,
// so a probing request can't tell an inactive form from a nonexistent one.
export async function getPublicFormById(id: string) {
	const doc = await FormModel.findOne({ id, deletedAt: null, status: 'active' })
		.select('-notificationEmails')
		.lean();
	if (!doc) throw new FormInactiveError();
	return cleanMongoFields(doc);
}
