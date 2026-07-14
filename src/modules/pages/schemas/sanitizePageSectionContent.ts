import { sanitizeHtml } from '@Helpers/sanitizeHtml';

interface RawElement {
	type?: unknown;
	html?: Record<string, unknown>;
	items?: unknown[];
}

function sanitizeLocalizedHtml(value: unknown): unknown {
	if (typeof value !== 'object' || value === null) return value;
	const result: Record<string, unknown> = {
		...(value as Record<string, unknown>),
	};
	for (const [lang, text] of Object.entries(result)) {
		if (typeof text === 'string') result[lang] = sanitizeHtml(text);
	}
	return result;
}

function sanitizeElement(element: unknown): unknown {
	if (typeof element !== 'object' || element === null) return element;
	const el = element as RawElement;

	// 'text' widget: the whole body is rendered as HTML in the builder preview.
	if (el.type === 'text' && el.html !== undefined) {
		return { ...el, html: sanitizeLocalizedHtml(el.html) };
	}

	// 'accordion' widget: only `answer` is rich text (RichTextArea); `question`
	// is a plain one-liner, rendered as safe JSX text — left untouched.
	if (el.type === 'accordion' && Array.isArray(el.items)) {
		return {
			...el,
			items: el.items.map((item) => {
				if (typeof item !== 'object' || item === null) return item;
				const it = item as Record<string, unknown>;
				return 'answer' in it
					? { ...it, answer: sanitizeLocalizedHtml(it.answer) }
					: it;
			}),
		};
	}

	return element;
}

/**
 * Sanitizes the rich-text (HTML) sub-fields of a page section's widget tree
 * — the text widget's body and accordion answers, the only two widget types
 * whose content is rendered via `dangerouslySetInnerHTML` on the frontend.
 * Every other widget/section shape passes through untouched: `content` has
 * no backend schema by design (opaque `z.record` — the builder's widget
 * tree is frontend-only), so this checks shape defensively instead of
 * asserting/rejecting on a mismatch, to stay safe against section types the
 * builder doesn't actively edit yet (see `BuilderSection` on the frontend).
 */
export function sanitizePageSectionContent(
	content: Record<string, unknown>,
): Record<string, unknown> {
	if (!Array.isArray(content.columns)) return content;

	return {
		...content,
		columns: content.columns.map((column) => {
			if (typeof column !== 'object' || column === null) return column;
			const col = column as Record<string, unknown>;
			if (!Array.isArray(col.elements)) return column;
			return { ...col, elements: col.elements.map(sanitizeElement) };
		}),
	};
}
