import { describe, it, expect } from 'vitest';
import { sanitizeHtml, stripHtml } from '@Helpers/sanitizeHtml';

describe('sanitizeHtml', () => {
	it('keeps basic formatting and strips scripts', () => {
		expect(sanitizeHtml('<p>hi</p><script>alert(1)</script>')).toBe('<p>hi</p>');
	});

	it('keeps text-align style on paragraphs/headings', () => {
		expect(sanitizeHtml('<p style="text-align: center">centered</p>')).toBe(
			'<p style="text-align:center">centered</p>',
		);
	});

	it('keeps links with href/target/rel', () => {
		const html = '<a href="https://x.com" target="_blank" rel="noopener noreferrer nofollow">link</a>';
		expect(sanitizeHtml(html)).toBe(html);
	});

	it('keeps real https/http image URLs but strips data: URIs', () => {
		expect(sanitizeHtml('<img src="https://cdn.example.com/a.png" alt="a">')).toBe(
			'<img src="https://cdn.example.com/a.png" alt="a" />',
		);
		expect(sanitizeHtml('<img src="data:image/png;base64,abc123">')).toBe('<img />');
	});

	it('keeps text color (Color/TextStyle extension span)', () => {
		const html = '<p>hello <span style="color: #EF4444">red</span> world</p>';
		expect(sanitizeHtml(html)).toBe('<p>hello <span style="color:#EF4444">red</span> world</p>');
	});

	it('strips a color value that is not a valid hex/rgb', () => {
		expect(sanitizeHtml('<span style="color: url(javascript:alert(1))">x</span>')).toBe('<span>x</span>');
	});

	it('keeps highlight marks with data-color and background-color', () => {
		const html = '<mark data-color="#FEF08A" style="background-color:#FEF08A;color:inherit">marked</mark>';
		expect(sanitizeHtml(html)).toBe(html);
	});

	it('keeps table structure (colgroup/col/tbody/tr/th/td, colspan/rowspan/colwidth)', () => {
		const html =
			'<table style="width:300px"><colgroup><col style="width:150px"><col style="width:150px"></colgroup>' +
			'<tbody><tr><th colspan="2">Header</th></tr><tr><td rowspan="1" colwidth="150">a</td><td>b</td></tr></tbody></table>';
		expect(sanitizeHtml(html)).toBe(
			'<table style="width:300px"><colgroup><col style="width:150px"></col><col style="width:150px"></col></colgroup>' +
				'<tbody><tr><th colspan="2">Header</th></tr><tr><td rowspan="1" colwidth="150">a</td><td>b</td></tr></tbody></table>',
		);
	});

	it('keeps a task list with checked state', () => {
		const html =
			'<ul data-type="taskList"><li data-type="taskItem" data-checked="true">' +
			'<label><input type="checkbox" checked><span></span></label><div><p>done</p></div></li></ul>';
		expect(sanitizeHtml(html)).toBe(
			'<ul data-type="taskList"><li data-type="taskItem" data-checked="true">' +
				'<label><input type="checkbox" checked /><span></span></label><div><p>done</p></div></li></ul>',
		);
	});

	it('neutralizes an input that is not a checkbox (attribute value cleared, not a valid form field)', () => {
		expect(sanitizeHtml('<input type="text" value="x">')).toBe('<input type />');
	});

	it('keeps a horizontal rule', () => {
		expect(sanitizeHtml('<p>before</p><hr><p>after</p>')).toBe('<p>before</p><hr /><p>after</p>');
	});

	it('keeps the code-block language class but strips unrelated classes', () => {
		expect(sanitizeHtml('<pre><code class="language-javascript">const x = 1;</code></pre>')).toBe(
			'<pre><code class="language-javascript">const x = 1;</code></pre>',
		);
		expect(sanitizeHtml('<code class="evil-class">x</code>')).toBe('<code>x</code>');
	});
});

describe('stripHtml', () => {
	it('removes all tags, keeping only text', () => {
		expect(stripHtml('<p>hi <strong>there</strong></p>')).toBe('hi there');
	});
});
