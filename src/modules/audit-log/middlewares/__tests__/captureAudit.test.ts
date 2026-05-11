import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'events';
import type { Request, Response, NextFunction } from 'express';

const { mockCreateAuditEntry } = vi.hoisted(() => ({
	mockCreateAuditEntry: vi.fn(),
}));

vi.mock('../../application/createAuditEntry', () => ({
	createAuditEntry: mockCreateAuditEntry,
}));

import { captureAudit } from '../captureAudit';

function buildRes(statusCode: number, locals: Record<string, unknown> = {}): Response {
	const emitter = new EventEmitter();
	return Object.assign(emitter, { statusCode, locals }) as unknown as Response;
}

function buildReq(overrides: Partial<Request> = {}): Request {
	return {
		headers: {},
		socket: { remoteAddress: '10.0.0.1' },
		...overrides,
	} as unknown as Request;
}

describe('captureAudit', () => {
	beforeEach(() => vi.clearAllMocks());

	it('calls next() immediately', () => {
		const next = vi.fn() as NextFunction;
		const handler = captureAudit({ action: 'auth:login', resource: 'auth' });
		handler(buildReq(), buildRes(200), next);
		expect(next).toHaveBeenCalledOnce();
	});

	it('calls createAuditEntry on finish with 2xx status', async () => {
		mockCreateAuditEntry.mockResolvedValue(undefined);
		const res = buildRes(200, { userId: 'user-1' });
		const req = buildReq({
			headers: { 'x-forwarded-for': '1.2.3.4', 'user-agent': 'TestAgent/1' },
		});

		const handler = captureAudit({ action: 'auth:login', resource: 'auth' });
		handler(req, res, vi.fn() as NextFunction);
		res.emit('finish');

		await vi.waitFor(() => expect(mockCreateAuditEntry).toHaveBeenCalledOnce());

		expect(mockCreateAuditEntry).toHaveBeenCalledWith(
			expect.objectContaining({
				userId: 'user-1',
				action: 'auth:login',
				resource: 'auth',
				ipAddress: '1.2.3.4',
				userAgent: 'TestAgent/1',
			}),
		);
	});

	it('does NOT call createAuditEntry on finish with 4xx status', () => {
		const res = buildRes(400);
		const handler = captureAudit({ action: 'auth:login', resource: 'auth' });
		handler(buildReq(), res, vi.fn() as NextFunction);
		res.emit('finish');
		expect(mockCreateAuditEntry).not.toHaveBeenCalled();
	});

	it('does NOT call createAuditEntry on finish with 5xx status', () => {
		const res = buildRes(500);
		const handler = captureAudit({ action: 'auth:login', resource: 'auth' });
		handler(buildReq(), res, vi.fn() as NextFunction);
		res.emit('finish');
		expect(mockCreateAuditEntry).not.toHaveBeenCalled();
	});

	it('falls back to socket.remoteAddress when x-forwarded-for is absent', async () => {
		mockCreateAuditEntry.mockResolvedValue(undefined);
		const res = buildRes(201);
		const req = buildReq({ headers: {}, socket: { remoteAddress: '9.9.9.9' } as never });

		captureAudit({ action: 'storage:uploaded', resource: 'storage' })(
			req,
			res,
			vi.fn() as NextFunction,
		);
		res.emit('finish');

		await vi.waitFor(() => expect(mockCreateAuditEntry).toHaveBeenCalledOnce());
		expect(mockCreateAuditEntry).toHaveBeenCalledWith(
			expect.objectContaining({ ipAddress: '9.9.9.9' }),
		);
	});

	it('passes userId as undefined when not in res.locals', async () => {
		mockCreateAuditEntry.mockResolvedValue(undefined);
		const res = buildRes(200, {});
		captureAudit({ action: 'auth:login', resource: 'auth' })(
			buildReq(),
			res,
			vi.fn() as NextFunction,
		);
		res.emit('finish');

		await vi.waitFor(() => expect(mockCreateAuditEntry).toHaveBeenCalledOnce());
		expect(mockCreateAuditEntry).toHaveBeenCalledWith(
			expect.objectContaining({ userId: undefined }),
		);
	});

	it('calls getResourceId when provided', async () => {
		mockCreateAuditEntry.mockResolvedValue(undefined);
		const res = buildRes(200);
		const req = buildReq({ params: { id: 'res-42' } } as Partial<Request>);
		const getResourceId = vi.fn().mockReturnValue('res-42');

		captureAudit({ action: 'users:deleted', resource: 'users', getResourceId })(
			req,
			res,
			vi.fn() as NextFunction,
		);
		res.emit('finish');

		await vi.waitFor(() => expect(mockCreateAuditEntry).toHaveBeenCalledOnce());
		expect(getResourceId).toHaveBeenCalledWith(req);
		expect(mockCreateAuditEntry).toHaveBeenCalledWith(
			expect.objectContaining({ resourceId: 'res-42' }),
		);
	});

	it('calls getMetadata when provided', async () => {
		mockCreateAuditEntry.mockResolvedValue(undefined);
		const res = buildRes(200);
		const req = buildReq({ body: { email: 'test@example.com' } } as Partial<Request>);
		const getMetadata = vi.fn().mockReturnValue({ email: 'test@example.com' });

		captureAudit({ action: 'auth:login', resource: 'auth', getMetadata })(
			req,
			res,
			vi.fn() as NextFunction,
		);
		res.emit('finish');

		await vi.waitFor(() => expect(mockCreateAuditEntry).toHaveBeenCalledOnce());
		expect(getMetadata).toHaveBeenCalledWith(req);
		expect(mockCreateAuditEntry).toHaveBeenCalledWith(
			expect.objectContaining({ metadata: { email: 'test@example.com' } }),
		);
	});

	it('swallows createAuditEntry errors silently', async () => {
		mockCreateAuditEntry.mockRejectedValue(new Error('db down'));
		const res = buildRes(200);

		captureAudit({ action: 'auth:login', resource: 'auth' })(
			buildReq(),
			res,
			vi.fn() as NextFunction,
		);
		res.emit('finish');

		await new Promise((r) => setTimeout(r, 10));
		expect(mockCreateAuditEntry).toHaveBeenCalledOnce();
	});
});
