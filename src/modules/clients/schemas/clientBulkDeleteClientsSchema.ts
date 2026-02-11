import { z } from 'zod';

export const BulkDeleteClientsSchema = z.object({
	ids: z.array(z.uuid('CLIENT_ID_INVALID')).min(1, 'CLIENT_IDS_REQUIRED'),
});
