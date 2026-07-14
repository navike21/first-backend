/**
 * Escapes regex-significant characters so user-controlled search terms can be
 * used as a literal substring match in a MongoDB `$regex` filter without
 * being interpreted as a pattern (prevents unexpected matches and ReDoS from
 * crafted patterns like `(a+)+`).
 */
export function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
