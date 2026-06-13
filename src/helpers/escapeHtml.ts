/**
 * Escapes the five HTML-significant characters so user-controlled values (e.g. a
 * person's name) can be safely interpolated into email HTML without allowing
 * markup/script injection.
 */
export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}
