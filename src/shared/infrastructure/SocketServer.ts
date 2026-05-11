import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'node:http';
import { ENV } from '@Constants/environments';
import { logInfo } from '@Helpers/log';

let io: SocketIOServer;

export function initSocketServer(httpServer: Server): SocketIOServer {
	io = new SocketIOServer(httpServer, {
		cors: {
			origin: ENV.WHITELISTED_DOMAINS
				? ENV.WHITELISTED_DOMAINS.split(',').map((d) => d.trim())
				: '*',
			methods: ['GET', 'POST'],
		},
	});

	io.on('connection', (socket) => {
		logInfo(`Socket connected: ${socket.id}`);
		socket.on('disconnect', () => {
			logInfo(`Socket disconnected: ${socket.id}`);
		});
	});

	return io;
}

export function getIO(): SocketIOServer {
	if (!io)
		throw new Error(
			'SocketServer not initialized. Call initSocketServer first.',
		);
	return io;
}

export function emitSessionUpdate(
	event: 'login' | 'logout',
	payload: { userId: string; sessionId?: string },
): void {
	if (!io) return;
	io.emit('sessions:update', {
		event,
		...payload,
		timestamp: new Date().toISOString(),
	});
}
