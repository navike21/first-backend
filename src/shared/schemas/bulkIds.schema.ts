import { z } from 'zod';

export const BulkIdsSchema = z.object({
	ids: z
		.array(z.uuid({ message: 'BULK_ID_INVALID' }), {
			error: (iss) =>
				iss.input === undefined ? 'BULK_IDS_REQUIRED' : 'BULK_IDS_INVALID',
		})
		.min(1, { message: 'BULK_IDS_MIN' })
		.max(100, { message: 'BULK_IDS_MAX' }),
});

export type BulkIdsInput = z.infer<typeof BulkIdsSchema>;
