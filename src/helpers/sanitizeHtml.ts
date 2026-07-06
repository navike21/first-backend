import sanitize from 'sanitize-html';

const ALLOWED_TAGS = [
	'p', 'br',
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'strong', 'em', 'u', 's',
	'ul', 'ol', 'li',
	'a', 'img',
	'blockquote', 'pre', 'code',
];

const ALLOWED_ATTRS: sanitize.IOptions['allowedAttributes'] = {
	a: ['href', 'target', 'rel'],
	img: ['src', 'alt', 'width', 'height'],
	'*': ['style'],
};

const ALLOWED_STYLES: sanitize.IOptions['allowedStyles'] = {
	'*': {
		'text-align': [/^(left|right|center|justify)$/],
	},
};

export function sanitizeHtml(dirty: string): string {
	return sanitize(dirty, {
		allowedTags: ALLOWED_TAGS,
		allowedAttributes: ALLOWED_ATTRS,
		allowedStyles: ALLOWED_STYLES,
		allowedSchemes: ['https', 'http', 'mailto'],
		enforceHtmlBoundary: true,
	});
}

export function stripHtml(html: string): string {
	return sanitize(html, { allowedTags: [], allowedAttributes: {} });
}
