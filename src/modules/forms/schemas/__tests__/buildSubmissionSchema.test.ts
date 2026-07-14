import { describe, it, expect } from 'vitest';
import { buildSubmissionSchema } from '@Modules/forms/schemas/buildSubmissionSchema';
import type {
	FormFieldConfig,
	FormFieldType,
} from '@Modules/forms/schemas/form.schema';

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

function makeField(
	type: FormFieldType,
	overrides: Partial<FormFieldConfig> = {},
): FormFieldConfig {
	return {
		fieldId: 'field-1',
		type,
		label: emptyLocalized,
		required: true,
		...overrides,
	};
}

describe('buildSubmissionSchema', () => {
	it('text: accepts a string, rejects over maxLength', () => {
		const schema = buildSubmissionSchema([makeField('text', { maxLength: 5 })]);
		expect(schema.safeParse({ 'field-1': 'hi' }).success).toBe(true);
		expect(schema.safeParse({ 'field-1': 'too long value' }).success).toBe(
			false,
		);
	});

	it('textarea: accepts a string', () => {
		const schema = buildSubmissionSchema([makeField('textarea')]);
		expect(schema.safeParse({ 'field-1': 'a long paragraph' }).success).toBe(
			true,
		);
	});

	it('email: accepts a valid email, rejects an invalid one', () => {
		const schema = buildSubmissionSchema([makeField('email')]);
		expect(schema.safeParse({ 'field-1': 'user@example.com' }).success).toBe(
			true,
		);
		expect(schema.safeParse({ 'field-1': 'not-an-email' }).success).toBe(false);
	});

	it('phone: accepts a string within maxLength', () => {
		const schema = buildSubmissionSchema([makeField('phone')]);
		expect(schema.safeParse({ 'field-1': '+1 555 0100' }).success).toBe(true);
	});

	it('checkbox: accepts a boolean, rejects a non-boolean', () => {
		const schema = buildSubmissionSchema([makeField('checkbox')]);
		expect(schema.safeParse({ 'field-1': true }).success).toBe(true);
		expect(schema.safeParse({ 'field-1': 'true' }).success).toBe(false);
	});

	it('checkbox: optional field defaults to false when omitted', () => {
		const schema = buildSubmissionSchema([
			makeField('checkbox', { required: false }),
		]);
		const result = schema.safeParse({});
		expect(result.success).toBe(true);
		if (result.success) expect(result.data['field-1']).toBe(false);
	});

	it('date: accepts an ISO date string, rejects a non-date string', () => {
		const schema = buildSubmissionSchema([makeField('date')]);
		expect(schema.safeParse({ 'field-1': '2026-01-15' }).success).toBe(true);
		expect(schema.safeParse({ 'field-1': 'not-a-date' }).success).toBe(false);
	});

	it('select: accepts a listed option value, rejects an unlisted one', () => {
		const schema = buildSubmissionSchema([
			makeField('select', {
				options: [
					{ value: 'a', label: emptyLocalized },
					{ value: 'b', label: emptyLocalized },
				],
			}),
		]);
		expect(schema.safeParse({ 'field-1': 'a' }).success).toBe(true);
		expect(schema.safeParse({ 'field-1': 'c' }).success).toBe(false);
	});

	it('radio: accepts a listed option value, rejects an unlisted one', () => {
		const schema = buildSubmissionSchema([
			makeField('radio', {
				options: [
					{ value: 'yes', label: emptyLocalized },
					{ value: 'no', label: emptyLocalized },
				],
			}),
		]);
		expect(schema.safeParse({ 'field-1': 'yes' }).success).toBe(true);
		expect(schema.safeParse({ 'field-1': 'maybe' }).success).toBe(false);
	});

	it('select/radio: degrades to a plain string when options are empty (defensive branch)', () => {
		const schema = buildSubmissionSchema([
			makeField('select', { options: [] }),
		]);
		expect(schema.safeParse({ 'field-1': 'anything' }).success).toBe(true);
	});

	it('required field rejects when omitted', () => {
		const schema = buildSubmissionSchema([
			makeField('text', { required: true }),
		]);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('optional non-checkbox field is fine when omitted', () => {
		const schema = buildSubmissionSchema([
			makeField('text', { required: false }),
		]);
		expect(schema.safeParse({}).success).toBe(true);
	});

	it('rejects a key for a field that does not exist on this form (.strict())', () => {
		const schema = buildSubmissionSchema([makeField('text')]);
		const result = schema.safeParse({ 'field-1': 'ok', 'field-2': 'sneaky' });
		expect(result.success).toBe(false);
	});

	it('an unrecognized field type falls through to the text (default) branch without throwing', () => {
		const schema = buildSubmissionSchema([
			makeField('unknown-type' as FormFieldType),
		]);
		expect(() => schema.safeParse({ 'field-1': 'hello' })).not.toThrow();
		expect(schema.safeParse({ 'field-1': 'hello' }).success).toBe(true);
	});
});
