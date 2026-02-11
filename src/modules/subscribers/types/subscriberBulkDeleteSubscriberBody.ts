import { z } from 'zod';
import { BulkDeleteSubscriberSchema } from '../schemas/subscriberBulkDeleteSubscriberSchema';

export type BulkDeleteSubscriberBody = z.infer<
	typeof BulkDeleteSubscriberSchema
>;
