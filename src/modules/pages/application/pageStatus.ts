/**
 * There is no cron/scheduler in this backend. Instead of a job flipping
 * `scheduled` pages to `published` at the right time, the effective status is
 * computed on read: a `scheduled` page whose `scheduledAt` has passed already
 * behaves as `published`, both for the public query filter and for what an
 * admin sees on the page.
 */

export interface PageStatusFields {
	status: string;
	scheduledAt?: Date | string | null;
}

export function resolveEffectiveStatus(page: PageStatusFields): string {
	if (
		page.status === 'scheduled' &&
		page.scheduledAt &&
		new Date(page.scheduledAt).getTime() <= Date.now()
	) {
		return 'published';
	}
	return page.status;
}

export function withEffectiveStatus<T extends PageStatusFields>(
	page: T,
): T & { effectiveStatus: string } {
	return { ...page, effectiveStatus: resolveEffectiveStatus(page) };
}

/** Mongo filter matching pages that are publicly visible right now. */
export function publicVisibilityFilter(): Record<string, unknown> {
	return {
		deletedAt: null,
		$or: [
			{ status: 'published' },
			{ status: 'scheduled', scheduledAt: { $lte: new Date() } },
		],
	};
}
