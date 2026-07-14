import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/forms/infrastructure/FormModel', () => ({
	default: { findOne: vi.fn() },
}));
vi.mock('@Modules/forms/infrastructure/FormSubmissionModel', () => ({
	default: { create: vi.fn() },
}));
vi.mock('@Shared/infrastructure/EventBus', () => ({
	eventBus: { publish: vi.fn().mockResolvedValue(undefined) },
	DomainEvent: class DomainEvent {
		readonly occurredAt = new Date();
	},
}));

import { submitForm } from '@Modules/forms/application/submitForm';
import FormModel from '@Modules/forms/infrastructure/FormModel';
import FormSubmissionModel from '@Modules/forms/infrastructure/FormSubmissionModel';
import { eventBus } from '@Shared/infrastructure/EventBus';
import { FormInactiveError } from '@Modules/forms/domain/errors/FormErrors';

const emptyLocalized = {
	en: 'Email',
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

const activeForm = {
	id: 'form-1',
	title: emptyLocalized,
	status: 'active',
	notificationEmails: [] as string[],
	fields: [
		{ fieldId: 'f1', type: 'email', label: emptyLocalized, required: true },
	],
};

describe('submitForm', () => {
	it('throws FormInactiveError when the form is missing, inactive, or deleted', async () => {
		vi.mocked(FormModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(null),
		} as never);

		await expect(
			submitForm('form-1', { f1: 'user@example.com' }),
		).rejects.toThrow(FormInactiveError);
		expect(FormSubmissionModel.create).not.toHaveBeenCalled();
	});

	it("validates the payload against the form's current fields and persists it", async () => {
		vi.mocked(FormModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(activeForm),
		} as never);
		vi.mocked(FormSubmissionModel.create).mockResolvedValue({
			toObject: vi.fn().mockReturnValue({ id: 'sub-1', formId: 'form-1' }),
		} as never);

		await submitForm('form-1', { f1: 'user@example.com' }, { lang: 'en' });

		expect(FormSubmissionModel.create).toHaveBeenCalledWith(
			expect.objectContaining({
				formId: 'form-1',
				data: { f1: 'user@example.com' },
			}),
		);
	});

	it('rejects an invalid value for a field (422 via validate())', async () => {
		vi.mocked(FormModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(activeForm),
		} as never);

		await expect(
			submitForm('form-1', { f1: 'not-an-email' }),
		).rejects.toThrow();
		expect(FormSubmissionModel.create).not.toHaveBeenCalled();
	});

	it('does not publish an email event when notificationEmails is empty', async () => {
		vi.mocked(FormModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue(activeForm),
		} as never);
		vi.mocked(FormSubmissionModel.create).mockResolvedValue({
			toObject: vi.fn().mockReturnValue({ id: 'sub-1' }),
		} as never);

		await submitForm('form-1', { f1: 'user@example.com' });

		expect(eventBus.publish).not.toHaveBeenCalled();
	});

	it('publishes an email event when notificationEmails is populated', async () => {
		vi.mocked(FormModel.findOne).mockReturnValue({
			lean: vi.fn().mockResolvedValue({
				...activeForm,
				notificationEmails: ['owner@example.com'],
			}),
		} as never);
		vi.mocked(FormSubmissionModel.create).mockResolvedValue({
			toObject: vi.fn().mockReturnValue({ id: 'sub-1' }),
		} as never);

		await submitForm('form-1', { f1: 'user@example.com' }, { lang: 'en' });

		expect(eventBus.publish).toHaveBeenCalledTimes(1);
	});
});
