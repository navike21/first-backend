export function toSlug(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replaceAll(/\s+/g, '-')
		.replaceAll(/[^a-z0-9-]/g, '')
		.replaceAll(/-+/g, '-');
}
