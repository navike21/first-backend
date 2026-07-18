import type { Types } from 'mongoose';
import { ENV } from '@Constants/environments';
import { logError } from '@Helpers/log';
import EmailOutboxModel from '../infrastructure/EmailOutboxModel';
import { getEmailTransport } from '../infrastructure/transport/getEmailTransport';

export interface DispatchResult {
	processed: number;
	sent: number;
	retried: number;
	failed: number;
}

/**
 * Reclama una fila enviable de forma atómica: una `pending`, o una `sending`
 * cuyo lease venció (invocación previa murió a mitad de envío). El
 * `findOneAndUpdate` marca `sending` + `lockedAt` en un solo paso, así dos
 * invocaciones concurrentes nunca toman la misma fila (no hay doble envío).
 *
 * `excludeIds` evita re-reclamar en la MISMA pasada una fila que acaba de
 * fallar y volvió a `pending`: un reintento debe esperar al próximo drenado
 * (espaciado por el schedule), no repetirse de inmediato sin backoff.
 */
async function claimNext(excludeIds: Types.ObjectId[]) {
	const leaseCutoff = new Date(Date.now() - ENV.EMAIL_OUTBOX_LEASE_MS);
	return EmailOutboxModel.findOneAndUpdate(
		{
			_id: { $nin: excludeIds },
			$or: [
				{ status: 'pending' },
				{ status: 'sending', lockedAt: { $lt: leaseCutoff } },
			],
		},
		{ $set: { status: 'sending', lockedAt: new Date() }, $inc: { attempts: 1 } },
		{ sort: { createdAt: 1 }, new: true },
	);
}

/**
 * Worker del outbox: drena hasta `limit` correos pendientes y los envía por el
 * transporte configurado. Éxito → `sent`. Fallo → reintento (vuelve a
 * `pending`) hasta `maxAttempts`, luego dead-letter (`failed`). Idempotente
 * entre invocaciones concurrentes gracias al reclamo atómico.
 */
export async function dispatchPendingEmails(
	limit: number = ENV.EMAIL_OUTBOX_BATCH_SIZE,
): Promise<DispatchResult> {
	const transport = getEmailTransport();
	const result: DispatchResult = { processed: 0, sent: 0, retried: 0, failed: 0 };
	const seen: Types.ObjectId[] = [];

	for (let i = 0; i < limit; i += 1) {
		const row = await claimNext(seen);
		if (!row) break;
		seen.push(row._id as Types.ObjectId);
		result.processed += 1;

		try {
			await transport.send({
				from: row.from ?? ENV.EMAIL_FROM,
				to: row.to as string,
				subject: row.subject as string,
				html: row.html as string,
			});
			row.set({ status: 'sent', sentAt: new Date(), lockedAt: null });
			await row.save();
			result.sent += 1;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			const deadLettered = (row.attempts as number) >= (row.maxAttempts as number);
			row.set({
				status: deadLettered ? 'failed' : 'pending',
				lastError: message,
				lockedAt: null,
			});
			await row.save();
			if (deadLettered) {
				result.failed += 1;
				logError(
					`[email] dead-lettered ${row.id} to ${row.to} after ${row.attempts} attempts: ${message}`,
				);
			} else {
				result.retried += 1;
			}
		}
	}

	return result;
}
