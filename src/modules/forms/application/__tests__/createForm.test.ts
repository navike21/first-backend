import { describe, it, expect, vi } from 'vitest';

vi.mock('@Constants/environments', () => ({
	ENV: { NODE_ENV: 'test' },
	ENVIRONMENT: 'test',
}));
vi.mock('@Modules/forms/infrastructure/FormModel', () => ({
	default: { create: vi.fn() },
}));

import { createForm } from '@Modules/forms/application/createForm';
import FormModel from '@Modules/forms/infrastructure/FormModel';

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

const validInput = {
	title: emptyLocalized,
	status: 'active' as const,
	notificationEmails: [],
	fields: [
		{ type: 'text' as const, label: emptyLocalized, required: true },
		{
			fieldId: 'existing-id',
			type: 'email' as const,
			label: emptyLocalized,
			required: false,
		},
	],
};

describe('createForm', () => {
	it('assigns a fieldId to fields missing one, keeps existing fieldIds untouched', async () => {
		vi.mocked(FormModel.create).mockImplementation(
			(doc: unknown) =>
				Promise.resolve({
					...(doc as object),
					toObject: vi
						.fn()
						.mockReturnValue({ ...(doc as object), _id: 'mongo1' }),
				}) as never,
		);

		await createForm(validInput);

		const createdArg = vi.mocked(FormModel.create).mock.calls[0][0] as {
			fields: { fieldId?: string }[];
		};
		expect(createdArg.fields[0].fieldId).toBeTruthy();
		expect(createdArg.fields[1].fieldId).toBe('existing-id');
	});

	it('returns cleaned data without Mongo internals', async () => {
		vi.mocked(FormModel.create).mockResolvedValue({
			toObject: vi
				.fn()
				.mockReturnValue({ ...validInput, id: 'form-1', _id: 'mongo1' }),
		} as never);

		const result = await createForm(validInput);
		expect(result).not.toHaveProperty('_id');
	});
});
