import { model, Schema } from 'mongoose';
import type { Options, Store as ExpressRateLimitStore, ClientRateLimitInfo } from 'express-rate-limit';

interface RateLimitHitDocument {
	key: string;
	count: number;
	resetTime: Date;
}

const rateLimitHitSchema = new Schema<RateLimitHitDocument>({
	key: { type: String, required: true, unique: true },
	count: { type: Number, required: true, default: 0 },
	resetTime: { type: Date, required: true },
});

// Auto-eliminar ventanas ya vencidas.
rateLimitHitSchema.index({ resetTime: 1 }, { expireAfterSeconds: 0 });

const RateLimitHitModel = model<RateLimitHitDocument>('RateLimitHit', rateLimitHitSchema);

/**
 * `express-rate-limit` `Store` respaldado en Mongo (colección compartida con
 * el resto de la app) en vez del `MemoryStore` por defecto. Necesario porque
 * en Vercel serverless cada instancia concurrente tiene su propia memoria: un
 * `MemoryStore` deja que un cliente que dispara requests en paralelo (varias
 * instancias) obtenga muchas más que `max` peticiones reales antes de que el
 * límite surta efecto en alguna de ellas.
 *
 * `prefix` namespacea las keys para que dos limiters (ej. global + auth) no
 * compartan contador aunque coincidan en IP.
 */
export class MongoRateLimitStore implements ExpressRateLimitStore {
	localKeys = false;
	windowMs = 60_000;
	readonly prefix: string;

	constructor(prefix: string) {
		this.prefix = prefix;
	}

	init(options: Options): void {
		this.windowMs = options.windowMs;
	}

	private scopedKey(key: string): string {
		return `${this.prefix}:${key}`;
	}

	async increment(key: string): Promise<ClientRateLimitInfo> {
		const now = new Date();
		const scopedKey = this.scopedKey(key);

		// Pipeline de update atómico: si la ventana ya venció (o el doc no
		// existe), reinicia count=1 y arranca una ventana nueva; si sigue
		// vigente, incrementa. Una sola operación de documento → sin carrera
		// entre instancias concurrentes leyendo-y-luego-escribiendo.
		const doc = await RateLimitHitModel.findOneAndUpdate(
			{ key: scopedKey },
			[
				{
					$set: {
						resetTime: {
							$cond: [
								{ $lte: ['$resetTime', now] },
								new Date(now.getTime() + this.windowMs),
								'$resetTime',
							],
						},
						count: {
							$cond: [{ $lte: ['$resetTime', now] }, 1, { $add: ['$count', 1] }],
						},
					},
				},
			],
			{
				upsert: true,
				returnDocument: 'after',
				setDefaultsOnInsert: true,
				updatePipeline: true,
			},
		).lean();

		return { totalHits: doc.count, resetTime: doc.resetTime };
	}

	async decrement(key: string): Promise<void> {
		await RateLimitHitModel.updateOne(
			{ key: this.scopedKey(key), count: { $gt: 0 } },
			{ $inc: { count: -1 } },
		);
	}

	async resetKey(key: string): Promise<void> {
		await RateLimitHitModel.deleteOne({ key: this.scopedKey(key) });
	}
}
