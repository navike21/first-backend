export const BLOG_STATUSES = ['draft', 'scheduled', 'published'] as const;

export type BlogStatus = (typeof BLOG_STATUSES)[number];
export const BLOG_STATUSES_ARRAY: [BlogStatus, ...BlogStatus[]] = [
	...BLOG_STATUSES,
];
