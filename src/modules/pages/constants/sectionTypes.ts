export const SECTION_TYPES = [
	'hero',
	'columns',
	'gallery',
	'testimonials',
	'map',
	'image_comparison',
	'cta',
	'features',
	'faq',
	'team',
	'stats',
	'richtext',
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];
