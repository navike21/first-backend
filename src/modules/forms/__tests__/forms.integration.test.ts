import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { createForm } from '../application/createForm';
import { updateForm } from '../application/updateForm';
import { getFormById } from '../application/getFormById';
import { getPublicFormById } from '../application/getPublicFormById';
import { listForms } from '../application/listForms';
import { listDeletedForms } from '../application/listDeletedForms';
import { deleteForm } from '../application/deleteForm';
import { restoreForm } from '../application/restoreForm';
import { purgeForm } from '../application/purgeForm';
import { deleteFormsBulk } from '../application/deleteFormsBulk';
import { restoreFormsBulk } from '../application/restoreFormsBulk';
import { purgeFormsBulk } from '../application/purgeFormsBulk';
import { submitForm } from '../application/submitForm';
import { listFormSubmissions } from '../application/listFormSubmissions';
import { listDeletedFormSubmissions } from '../application/listDeletedFormSubmissions';
import { getFormSubmissionById } from '../application/getFormSubmissionById';
import { markFormSubmissionRead } from '../application/markFormSubmissionRead';
import { deleteFormSubmission } from '../application/deleteFormSubmission';
import { restoreFormSubmission } from '../application/restoreFormSubmission';
import { purgeFormSubmission } from '../application/purgeFormSubmission';
import { deleteFormSubmissionsBulk } from '../application/deleteFormSubmissionsBulk';
import { restoreFormSubmissionsBulk } from '../application/restoreFormSubmissionsBulk';
import { purgeFormSubmissionsBulk } from '../application/purgeFormSubmissionsBulk';
import {
	FormInactiveError,
	FormNotFoundError,
} from '../domain/errors/FormErrors';
import FormSubmissionModel from '../infrastructure/FormSubmissionModel';

withMongo();

const emptyLocalized = {
	en: '',
	es: '',
	de: '',
	fr: '',
	it: '',
	ja: '',
	ko: '',
	pt: '',
	ru: '',
	zh: '',
};

type FormResult = {
	id: string;
	fields: { fieldId: string; type: string }[];
};

async function createTestForm(
	overrides: Partial<Record<string, unknown>> = {},
) {
	return (await createForm({
		title: { ...emptyLocalized, en: 'Contact us' },
		status: 'active',
		notificationEmails: [],
		fields: [
			{
				type: 'text',
				label: { ...emptyLocalized, en: 'Name' },
				required: true,
			},
			{
				type: 'select',
				label: { ...emptyLocalized, en: 'Reason' },
				required: true,
				options: [
					{ value: 'sales', label: { ...emptyLocalized, en: 'Sales' } },
					{ value: 'support', label: { ...emptyLocalized, en: 'Support' } },
				],
			},
		],
		...overrides,
	})) as FormResult;
}

describe('forms integration (withMongo)', () => {
	it('create → submit → list → mark-read → soft-delete → purge cascades correctly', async () => {
		const form = await createTestForm();
		const nameFieldId = form.fields.find((f) => f.type === 'text')!.fieldId;
		const reasonFieldId = form.fields.find((f) => f.type === 'select')!.fieldId;

		const submission = (await submitForm(form.id, {
			[nameFieldId]: 'Jane Doe',
			[reasonFieldId]: 'sales',
		})) as { id: string; formId: string; isRead: boolean };

		expect(submission.formId).toBe(form.id);

		const { data: listed } = await listFormSubmissions({
			formId: form.id,
			page: 1,
			limit: 10,
		});
		expect(listed).toHaveLength(1);
		expect((listed[0] as { id: string }).id).toBe(submission.id);

		const found = (await getFormSubmissionById(form.id, submission.id)) as {
			id: string;
		};
		expect(found.id).toBe(submission.id);

		const marked = (await markFormSubmissionRead(form.id, submission.id)) as {
			isRead: boolean;
		};
		expect(marked.isRead).toBe(true);

		await deleteForm(form.id);
		const stillThere = await FormSubmissionModel.findOne({
			formId: form.id,
			id: submission.id,
		}).lean();
		expect(stillThere).not.toBeNull();

		await purgeForm(form.id);
		const gone = await FormSubmissionModel.findOne({
			formId: form.id,
			id: submission.id,
		}).lean();
		expect(gone).toBeNull();
	});

	it('rejects a submission against an inactive form', async () => {
		const form = await createTestForm({ status: 'inactive' });

		await expect(
			submitForm(form.id, { [form.fields[0].fieldId]: 'hello' }),
		).rejects.toThrow(FormInactiveError);
	});

	it('getPublicFormById 404s for an inactive form and succeeds for an active one', async () => {
		const active = await createTestForm();
		const inactive = await createTestForm({ status: 'inactive' });

		const publicForm = (await getPublicFormById(active.id)) as {
			id: string;
			notificationEmails?: unknown;
		};
		expect(publicForm.id).toBe(active.id);
		expect(publicForm.notificationEmails).toBeUndefined();

		await expect(getPublicFormById(inactive.id)).rejects.toThrow(
			FormInactiveError,
		);
	});

	it('getFormById returns the admin view, throws when missing', async () => {
		const form = await createTestForm();
		const found = (await getFormById(form.id)) as { id: string };
		expect(found.id).toBe(form.id);

		await expect(getFormById('nonexistent-id')).rejects.toThrow(
			FormNotFoundError,
		);
	});

	it('updateForm replaces fields (assigning fieldIds to new ones) and updates title', async () => {
		const form = await createTestForm();

		const updated = (await updateForm(form.id, {
			title: { ...emptyLocalized, en: 'Updated title' },
			fields: [
				{
					type: 'email',
					label: { ...emptyLocalized, en: 'Email' },
					required: true,
				},
			],
		})) as {
			title: Record<string, string>;
			fields: { fieldId: string; type: string }[];
		};

		expect(updated.title.en).toBe('Updated title');
		expect(updated.fields).toHaveLength(1);
		expect(updated.fields[0].fieldId).toBeTruthy();
	});

	it('listForms filters by search and status', async () => {
		await createTestForm({
			title: { ...emptyLocalized, en: 'Job application' },
		});
		await createTestForm({
			title: { ...emptyLocalized, en: 'Newsletter signup' },
			status: 'inactive',
		});

		const bySearch = await listForms({ page: 1, limit: 10, search: 'Job' });
		expect(bySearch.data).toHaveLength(1);

		const byStatus = await listForms({
			page: 1,
			limit: 10,
			status: 'inactive',
		});
		expect(byStatus.data).toHaveLength(1);
	});

	it('soft-delete → trash list → restore a single form', async () => {
		const form = await createTestForm();
		await deleteForm(form.id);

		const trash = await listDeletedForms({ page: 1, limit: 10 });
		expect(trash.data.map((f) => (f as { id: string }).id)).toContain(form.id);

		const restored = (await restoreForm(form.id)) as { deletedAt?: Date };
		expect(restored.deletedAt).toBeUndefined();

		const activeAgain = await listForms({ page: 1, limit: 10 });
		expect(activeAgain.data.map((f) => (f as { id: string }).id)).toContain(
			form.id,
		);
	});

	it('purgeForm throws when the form is not in trash', async () => {
		const form = await createTestForm();
		await expect(purgeForm(form.id)).rejects.toThrow();
	});

	it('bulk delete/restore/purge forms', async () => {
		const a = await createTestForm();
		const b = await createTestForm();

		const deleted = await deleteFormsBulk([a.id, b.id, 'missing-id']);
		expect(deleted.processedIds.sort()).toEqual([a.id, b.id].sort());
		expect(deleted.notFoundIds).toEqual(['missing-id']);

		const restored = await restoreFormsBulk([a.id, b.id]);
		expect(restored.processedIds.sort()).toEqual([a.id, b.id].sort());

		await deleteFormsBulk([a.id, b.id]);
		const purged = await purgeFormsBulk([a.id, b.id]);
		expect(purged.processedIds.sort()).toEqual([a.id, b.id].sort());

		const trashAfterPurge = await listDeletedForms({ page: 1, limit: 10 });
		expect(
			trashAfterPurge.data.map((f) => (f as { id: string }).id),
		).not.toContain(a.id);
	});

	it('submission soft-delete/trash/restore/purge (single) and bulk variants', async () => {
		const form = await createTestForm();
		const nameFieldId = form.fields.find((f) => f.type === 'text')!.fieldId;
		const reasonFieldId = form.fields.find((f) => f.type === 'select')!.fieldId;

		const sub1 = (await submitForm(form.id, {
			[nameFieldId]: 'one',
			[reasonFieldId]: 'sales',
		})) as { id: string };
		const sub2 = (await submitForm(form.id, {
			[nameFieldId]: 'two',
			[reasonFieldId]: 'support',
		})) as { id: string };

		await deleteFormSubmission(form.id, sub1.id);
		const trash = await listDeletedFormSubmissions({
			formId: form.id,
			page: 1,
			limit: 10,
		});
		expect(trash.data.map((s) => (s as { id: string }).id)).toContain(sub1.id);

		await restoreFormSubmission(form.id, sub1.id);
		const activeSubs = await listFormSubmissions({
			formId: form.id,
			page: 1,
			limit: 10,
		});
		expect(activeSubs.data.map((s) => (s as { id: string }).id)).toContain(
			sub1.id,
		);

		const bulkDeleted = await deleteFormSubmissionsBulk(form.id, [
			sub1.id,
			sub2.id,
		]);
		expect(bulkDeleted.processedIds.sort()).toEqual([sub1.id, sub2.id].sort());

		const bulkRestored = await restoreFormSubmissionsBulk(form.id, [
			sub1.id,
			sub2.id,
		]);
		expect(bulkRestored.processedIds.sort()).toEqual([sub1.id, sub2.id].sort());

		await deleteFormSubmissionsBulk(form.id, [sub1.id, sub2.id]);
		const bulkPurged = await purgeFormSubmissionsBulk(form.id, [
			sub1.id,
			sub2.id,
		]);
		expect(bulkPurged.processedIds.sort()).toEqual([sub1.id, sub2.id].sort());

		const gone = await FormSubmissionModel.find({
			formId: form.id,
			id: { $in: [sub1.id, sub2.id] },
		}).lean();
		expect(gone).toHaveLength(0);

		await expect(purgeFormSubmission(form.id, sub1.id)).rejects.toThrow();
	});
});
