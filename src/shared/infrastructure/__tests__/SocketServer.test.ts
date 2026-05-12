import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Server } from 'node:http';

describe('SocketServer', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.doMock('@Modules/users/infrastructure/UserModel', () => ({
			default: { updateOne: vi.fn() },
		}));
		vi.doMock('@Shared/infrastructure/JwtService', () => ({
			JwtService: { verifyAccess: vi.fn() },
		}));
	});

	describe('getIO', () => {
		it('throws when SocketServer has not been initialized', async () => {
			// Arrange
			vi.doMock('@Constants/environments', () => ({
				ENV: { WHITELISTED_DOMAINS: '' },
			}));
			vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn() }));
			const { getIO } = await import('@Shared/infrastructure/SocketServer');

			// Act & Assert
			expect(() => getIO()).toThrow('SocketServer not initialized');
		});

		it('returns the io instance after initialization', async () => {
			// Arrange
			const mockIO = { emit: vi.fn(), on: vi.fn(), use: vi.fn() };
			vi.doMock('socket.io', () => ({
				Server: function MockServer() {
					return mockIO;
				},
			}));
			vi.doMock('@Constants/environments', () => ({
				ENV: { WHITELISTED_DOMAINS: 'http://localhost' },
			}));
			vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn() }));
			const { initSocketServer, getIO } =
				await import('@Shared/infrastructure/SocketServer');

			initSocketServer({} as Server);

			// Act & Assert
			expect(getIO()).toBe(mockIO);
		});
	});

	describe('initSocketServer', () => {
		it('creates a socket server with whitelisted domains from ENV', async () => {
			// Arrange
			const mockIO = { emit: vi.fn(), on: vi.fn(), use: vi.fn() };
			const MockServer = vi.fn(function MockServer() {
				return mockIO;
			});
			vi.doMock('socket.io', () => ({ Server: MockServer }));
			vi.doMock('@Constants/environments', () => ({
				ENV: { WHITELISTED_DOMAINS: 'http://localhost:3000,http://app.test' },
			}));
			vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn() }));
			const { initSocketServer } =
				await import('@Shared/infrastructure/SocketServer');

			// Act
			const result = initSocketServer({} as Server);

			// Assert
			expect(result).toBe(mockIO);
			expect(MockServer).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					cors: expect.objectContaining({
						origin: ['http://localhost:3000', 'http://app.test'],
					}),
				}),
			);
		});

		it('uses wildcard origin when WHITELISTED_DOMAINS is not set', async () => {
			// Arrange
			const mockIO = { emit: vi.fn(), on: vi.fn(), use: vi.fn() };
			const MockServer = vi.fn(function MockServer() {
				return mockIO;
			});
			vi.doMock('socket.io', () => ({ Server: MockServer }));
			vi.doMock('@Constants/environments', () => ({
				ENV: { WHITELISTED_DOMAINS: undefined },
			}));
			vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn() }));
			const { initSocketServer } =
				await import('@Shared/infrastructure/SocketServer');

			// Act
			initSocketServer({} as Server);

			// Assert
			expect(MockServer).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					cors: expect.objectContaining({ origin: '*' }),
				}),
			);
		});

		it('logs socket connection and disconnection events', async () => {
			// Arrange
			const logInfoMock = vi.fn();
			let connectionCb: ((socket: unknown) => void) | undefined;
			const mockIO = {
				emit: vi.fn(),
				on: vi.fn((event: string, cb: (socket: unknown) => void) => {
					if (event === 'connection') connectionCb = cb;
				}),
				use: vi.fn(),
				to: vi.fn(() => ({ emit: vi.fn() })),
			};
			vi.doMock('socket.io', () => ({
				Server: function MockServer() {
					return mockIO;
				},
			}));
			vi.doMock('@Constants/environments', () => ({
				ENV: { WHITELISTED_DOMAINS: '' },
			}));
			vi.doMock('@Helpers/log', () => ({
				logInfo: logInfoMock,
				logError: vi.fn(),
			}));
			const { initSocketServer } =
				await import('@Shared/infrastructure/SocketServer');
			initSocketServer({} as Server);

			let disconnectCb: (() => void) | undefined;
			const mockSocket = {
				id: 'socket-abc',
				data: {},
				join: vi.fn(),
				emit: vi.fn(),
				on: vi.fn((event: string, cb: () => void) => {
					if (event === 'disconnect') disconnectCb = cb;
				}),
			};

			// Act — simulate connection (async handler; drain microtasks so disconnect is registered)
			await (connectionCb!(mockSocket) as Promise<void> | void);

			// Assert — connection log
			expect(logInfoMock).toHaveBeenCalledWith(
				'Socket connected: socket-abc (user: undefined)',
			);

			// Act — simulate disconnect
			disconnectCb!();

			// Assert — disconnect log
			expect(logInfoMock).toHaveBeenCalledWith(
				'Socket disconnected: socket-abc (user: undefined)',
			);
		});
	});

	describe('emitSessionUpdate', () => {
		it('does not throw when the socket server is not initialized', async () => {
			// Arrange
			vi.doMock('@Constants/environments', () => ({
				ENV: { WHITELISTED_DOMAINS: '' },
			}));
			vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn() }));
			const { emitSessionUpdate } =
				await import('@Shared/infrastructure/SocketServer');

			// Act & Assert
			expect(() => emitSessionUpdate('login', { userId: 'u1' })).not.toThrow();
		});

		it('emits a sessions:update event when io is initialized', async () => {
			// Arrange
			const emitMock = vi.fn();
			const mockIO = { emit: emitMock, on: vi.fn(), use: vi.fn() };
			vi.doMock('socket.io', () => ({
				Server: function MockServer() {
					return mockIO;
				},
			}));
			vi.doMock('@Constants/environments', () => ({
				ENV: { WHITELISTED_DOMAINS: 'http://localhost' },
			}));
			vi.doMock('@Helpers/log', () => ({ logInfo: vi.fn() }));
			const { initSocketServer, emitSessionUpdate } =
				await import('@Shared/infrastructure/SocketServer');
			initSocketServer({} as Server);

			// Act
			emitSessionUpdate('logout', { userId: 'u1', sessionId: 's1' });

			// Assert
			expect(emitMock).toHaveBeenCalledWith(
				'sessions:update',
				expect.objectContaining({ event: 'logout', userId: 'u1' }),
			);
		});
	});
});
