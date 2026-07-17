import sanitize from 'sanitize-html';

// Whitelist mirrors exactly what the frontend's RichTextArea (Tiptap) can
// produce — StarterKit, Underline, TextAlign, Link, Image, Color/TextStyle,
// Highlight, TaskList/TaskItem, Table*, CodeBlockLowlight — so that using any
// toolbar feature there survives a save. If a new Tiptap extension is added
// to RichTextArea, extend this list to match (see sanitizeHtml.test.ts).
const ALLOWED_TAGS = [
	'p',
	'br',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'strong',
	'em',
	'u',
	's',
	'span',
	'mark',
	'ul',
	'ol',
	'li',
	'a',
	'img',
	'blockquote',
	'pre',
	'code',
	'hr',
	'table',
	'colgroup',
	'col',
	'tbody',
	'tr',
	'th',
	'td',
	'label',
	'input',
	'div',
];

const ALLOWED_ATTRS: sanitize.IOptions['allowedAttributes'] = {
	a: ['href', 'target', 'rel'],
	img: ['src', 'alt', 'width', 'height'],
	// Highlight extension (see @tiptap/extension-highlight renderHTML).
	mark: ['data-color'],
	// TaskList/TaskItem (see @tiptap/extension-list renderHTML) — restricted
	// to the exact tag/attribute values Tiptap itself emits.
	ul: [{ name: 'data-type', values: ['taskList'] }],
	li: [
		{ name: 'data-type', values: ['taskItem'] },
		{ name: 'data-checked', values: ['true', 'false'] },
	],
	input: [
		{ name: 'type', values: ['checkbox'] },
		{ name: 'checked', values: ['checked'] },
	],
	// Table extension: colspan/rowspan/colwidth are plain numeric metadata,
	// not an injection vector — no `values` restriction needed.
	td: ['colspan', 'rowspan', 'colwidth'],
	th: ['colspan', 'rowspan', 'colwidth'],
	'*': ['style'],
};

const ALLOWED_STYLES: sanitize.IOptions['allowedStyles'] = {
	'*': {
		'text-align': [/^(left|right|center|justify)$/],
	},
	// Color extension: <span style="color: #rrggbb">.
	span: {
		color: [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/],
	},
	// Highlight extension: <mark style="background-color: #rrggbb; color: inherit">.
	mark: {
		'background-color': [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/],
		color: [/^inherit$/],
	},
	// Table/col width, always computed by Tiptap in px (see createColGroup).
	table: {
		width: [/^\d+px$/],
		'min-width': [/^\d+px$/],
	},
	col: {
		width: [/^\d+px$/],
		'min-width': [/^\d+px$/],
	},
};

// CodeBlockLowlight's language, e.g. <code class="language-javascript">.
const ALLOWED_CLASSES: sanitize.IOptions['allowedClasses'] = {
	code: ['language-*'],
};

export function sanitizeHtml(dirty: string): string {
	return sanitize(dirty, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: ALLOWED_ATTRS,
		allowedStyles: ALLOWED_STYLES,
		allowedClasses: ALLOWED_CLASSES,
		// Deliberately no `data:` scheme: embedded rich-text images are
		// uploaded to real storage before save (see `resolveRichTextImages`
		// on the frontend) instead of being inlined as base64 here — keeps
		// this sanitizer safe as a fallback if that upload ever fails.
		allowedSchemes: ['https', 'http', 'mailto'],
		enforceHtmlBoundary: true,
	});
}

export function stripHtml(html: string): string {
	return sanitize(html, { allowedTags: [], allowedAttributes: {} });
}
