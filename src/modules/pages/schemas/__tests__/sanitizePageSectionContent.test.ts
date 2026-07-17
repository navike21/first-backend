import { describe, it, expect } from 'vitest';
import { sanitizePageSectionContent } from '@Modules/pages/schemas/sanitizePageSectionContent';

describe('sanitizePageSectionContent', () => {
	it('passes through content with no columns array untouched', () => {
		const content = { headline: 'Welcome', items: [] };
		expect(sanitizePageSectionContent(content)).toEqual(content);
	});

	it('sanitizes a text widget body (script tag)', () => {
		const content = {
			columns: [
				{
					id: 'col-1',
					elements: [
						{
							id: 'el-1',
							type: 'text',
							html: {
								en: '<p>hi</p><script>alert(1)</script>',
								es: '<p>hola</p>',
							},
						},
					],
				},
			],
		};

		const result = sanitizePageSectionContent(content) as {
			columns: { elements: { html: Record<string, string> }[] }[];
		};

		expect(result.columns[0].elements[0].html.en).toBe('<p>hi</p>');
		expect(result.columns[0].elements[0].html.es).toBe('<p>hola</p>');
	});

	it('sanitizes accordion answers but leaves questions untouched', () => {
		const content = {
			columns: [
				{
					id: 'col-1',
					elements: [
						{
							id: 'el-1',
							type: 'accordion',
							items: [
								{
									id: 'item-1',
									question: { en: '<img src=x onerror=alert(1)>What?' },
									answer: { en: '<p>Because.</p><script>alert(1)</script>' },
								},
							],
						},
					],
				},
			],
		};

		const result = sanitizePageSectionContent(content) as {
			columns: {
				elements: {
					items: {
						question: Record<string, string>;
						answer: Record<string, string>;
					}[];
				}[];
			}[];
		};
		const item = result.columns[0].elements[0].items[0];

		expect(item.answer.en).toBe('<p>Because.</p>');
		// question is deliberately NOT sanitized here (plain text field,
		// rendered as safe JSX on the frontend, not via dangerouslySetInnerHTML).
		expect(item.question.en).toContain('onerror');
	});

	it('leaves non-text/accordion widgets untouched', () => {
		const content = {
			columns: [
				{
					id: 'col-1',
					elements: [
						{
							id: 'el-1',
							type: 'button',
							label: { en: 'Click <b>me</b>' },
							url: 'https://x.com',
						},
					],
				},
			],
		};

		expect(sanitizePageSectionContent(content)).toEqual(content);
	});

	it('preserves rich formatting (color, table, task list) in a text widget body', () => {
		const html =
			'<p>Plan: <span style="color: #EF4444">urgent</span></p>' +
			'<table style="width:300px"><colgroup><col style="width:300px"></colgroup><tbody><tr><td>a</td></tr></tbody></table>' +
			'<ul data-type="taskList"><li data-type="taskItem" data-checked="true">' +
			'<label><input type="checkbox" checked><span></span></label><div><p>done</p></div></li></ul>';
		const content = {
			columns: [
				{ id: 'col-1', elements: [{ id: 'el-1', type: 'text', html: { en: html } }] },
			],
		};

		const result = sanitizePageSectionContent(content) as {
			columns: { elements: { html: Record<string, string> }[] }[];
		};

		expect(result.columns[0].elements[0].html.en).toContain('color:#EF4444');
		expect(result.columns[0].elements[0].html.en).toContain('<table');
		expect(result.columns[0].elements[0].html.en).toContain('data-checked="true"');
	});

	it('does not throw on a malformed/unexpected column or element shape', () => {
		const content = {
			columns: [null, { id: 'col-1' }, { id: 'col-2', elements: [null, 42] }],
		};
		expect(() => sanitizePageSectionContent(content)).not.toThrow();
	});
});
