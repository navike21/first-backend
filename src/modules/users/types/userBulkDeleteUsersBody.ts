import { z } from 'zod';
import { BulkDeleteUsersSchema } from '../schemas/userBulkDeleteUsersSchema';

export type BulkDeleteUsersBody = z.infer<typeof BulkDeleteUsersSchema>;
