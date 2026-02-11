import { z } from 'zod';

export const BulkDeleteSubscriberSchema = z.object({
	ids: z
		.array(z.uuid('SUBSCRIBER_ID_INVALID'))
		.min(1, 'SUBSCRIBER_IDS_REQUIRED'),
});
