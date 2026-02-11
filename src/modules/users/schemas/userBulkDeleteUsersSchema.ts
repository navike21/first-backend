import { z } from 'zod';

export const BulkDeleteUsersSchema = z.object({
	ids: z.array(z.uuid('USER_ID_INVALID')).min(1, 'USER_IDS_REQUIRED'),
});
