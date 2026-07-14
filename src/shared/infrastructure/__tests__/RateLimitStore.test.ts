import { describe, it, expect } from 'vitest';
import { withMongo } from '@test/withMongo';
import { MongoRateLimitStore } from '@Shared/infrastructure/RateLimitStore';

withMongo();

function makeStore(prefix: string, windowMs = 60_000): MongoRateLimitStore {
	const store = new MongoRateLimitStore(prefix);
	store.init({ windowMs } as never);
	return store;
}

describe('MongoRateLimitStore', () => {
	it('starts a new window at count 1 on the first hit', async () => {
		const store = makeStore('test-a');
		const key = crypto.randomUUID();

		const result = await store.increment(key);

		expect(result.totalHits).toBe(1);
		expect(result.resetTime).toBeInstanceOf(Date);
		expect(result.resetTime!.getTime()).toBeGreaterThan(Date.now());
	});

	it('increments the same window on subsequent hits', async () => {
		const store = makeStore('test-b');
		const key = crypto.randomUUID();

		const first = await store.increment(key);
		const second = await store.increment(key);
		const third = await store.increment(key);

		expect(third.totalHits).toBe(3);
		expect(second.resetTime).toEqual(first.resetTime);
		expect(third.resetTime).toEqual(first.resetTime);
	});

	it('starts a fresh window once the previous one has expired', async () => {
		// windowMs=0 makes every subsequent increment see an already-expired window.
		const store = makeStore('test-c', 0);
		const key = crypto.randomUUID();

		await store.increment(key);
		await new Promise((r) => setTimeout(r, 5));
		const second = await store.increment(key);

		expect(second.totalHits).toBe(1);
	});

	it('decrements without going below zero', async () => {
		const store = makeStore('test-d');
		const key = crypto.randomUUID();

		await store.increment(key);
		await store.increment(key);
		await store.decrement(key);
		await store.decrement(key);
		await store.decrement(key);
		const result = await store.increment(key);

		expect(result.totalHits).toBe(1);
	});

	it('resetKey removes the counter so the next hit starts at 1', async () => {
		const store = makeStore('test-e');
		const key = crypto.randomUUID();

		await store.increment(key);
		await store.increment(key);
		await store.resetKey(key);
		const result = await store.increment(key);

		expect(result.totalHits).toBe(1);
	});

	it('namespaces keys by prefix so two limiters never share a counter', async () => {
		const key = crypto.randomUUID();
		const storeA = makeStore('limiter-a');
		const storeB = makeStore('limiter-b');

		await storeA.increment(key);
		await storeA.increment(key);
		const resultB = await storeB.increment(key);

		expect(resultB.totalHits).toBe(1);
	});
});
