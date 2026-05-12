export const PILLARS = [
	'responsibility',
	'people',
	'continuous-learning',
	'tech-adaptation',
	'digital-experience',
	'business-growth',
] as const;

export type Pillar = (typeof PILLARS)[number];
export const PILLARS_ARRAY: [Pillar, ...Pillar[]] = [...PILLARS];
