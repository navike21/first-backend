export interface BulkResultLike {
	processedIds: string[];
	notFoundIds: string[];
}

export type BulkOutcome = 'NONE' | 'PARTIAL' | 'SUCCESS';

/**
 * Classifies the result of a bulk operation into a single outcome category,
 * used to build the response code suffix (e.g. `..._PARTIAL`). Shared across all
 * bulk controllers (clients, users, services, …) to avoid repeating the logic.
 */
export function bulkOutcome(result: BulkResultLike): BulkOutcome {
	if (result.processedIds.length === 0) return 'NONE';
	if (result.notFoundIds.length > 0) return 'PARTIAL';
	return 'SUCCESS';
}
