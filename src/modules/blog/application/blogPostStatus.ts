/**
 * There is no cron/scheduler in this backend. Instead of a job flipping
 * `scheduled` posts to `published` at the right time, the effective status is
 * computed on read: a `scheduled` post whose `scheduledAt` has passed already
 * behaves as `published`, both for the public query filter and for what an
 * admin sees on the post. Mirrors `pages/application/pageStatus.ts`.
 */

export interface BlogPostStatusFields {
	status: string;
	scheduledAt?: Date | string | null;
}

export function resolveEffectiveStatus(post: BlogPostStatusFields): string {
	if (
		post.status === 'scheduled' &&
		post.scheduledAt &&
		new Date(post.scheduledAt).getTime() <= Date.now()
	) {
		return 'published';
	}
	return post.status;
}

/** Mongo filter matching blog posts that are publicly visible right now. */
export function publicVisibilityFilter(): Record<string, unknown> {
	return {
		deletedAt: null,
		$or: [
			{ status: 'published' },
			{ status: 'scheduled', scheduledAt: { $lte: new Date() } },
		],
	};
}
