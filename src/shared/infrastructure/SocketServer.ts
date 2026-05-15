import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server } from 'node:http';
import { ENV } from '@Constants/environments';
import { JwtService } from './JwtService';
import { logInfo, logError } from '@Helpers/log';
import UserModel from '@Modules/users/infrastructure/UserModel';

let io: SocketIOServer;

const connectedUsers = new Map<string, Set<string>>();

function addUserSocket(userId: string, socketId: string) {
	if (!connectedUsers.has(userId)) {
		connectedUsers.set(userId, new Set());
	}
	connectedUsers.get(userId)!.add(socketId);
}

function removeUserSocket(userId: string, socketId: string): boolean {
	const sockets = connectedUsers.get(userId);
	if (!sockets) return false;
	sockets.delete(socketId);
	if (sockets.size === 0) {
		connectedUsers.delete(userId);
		return true;
	}
	return false;
}

async function setPresence(userId: string, status: string) {
	const update: Record<string, unknown> = { presenceStatus: status };
	if (status === 'offline') update.lastSeenAt = new Date();
	await UserModel.updateOne({ id: userId }, { $set: update });
}

function broadcastPresenceChange(userId: string, status: string) {
	if (!io) return;
	io.to('presence').emit('presence:changed', {
		userId,
		status,
		timestamp: new Date().toISOString(),
	});
}

async function handleDisconnect(socket: Socket, userId: string) {
	logInfo(`Socket disconnected: ${socket.id} (user: ${userId})`);
	const isLastSocket = removeUserSocket(userId, socket.id);
	if (isLastSocket) {
		await setPresence(userId, 'offline').catch(() => {});
		broadcastPresenceChange(userId, 'offline');
	}
}

export function initSocketServer(httpServer: Server): SocketIOServer {
	io = new SocketIOServer(httpServer, {
		cors: {
			origin: ENV.WHITELISTED_DOMAINS
				? ENV.WHITELISTED_DOMAINS.split(',').map((d) => d.trim())
				: '*',
			methods: ['GET', 'POST'],
		},
	});

	io.use((socket, next) => {
		const token =
			(socket.handshake.auth?.token as string | undefined) ??
			(socket.handshake.query?.token as string | undefined);

		if (!token) {
			return next(new Error('Authentication required'));
		}

		try {
			const payload = JwtService.verifyAccess(token);
			socket.data.userId = payload.sub;
			socket.data.permissions = payload.permissions;
			next();
		} catch {
			next(new Error('Invalid or expired token'));
		}
	});

	io.on('connection', async (socket) => {
		const userId = socket.data.userId as string;
		logInfo(`Socket connected: ${socket.id} (user: ${userId})`);

		addUserSocket(userId, socket.id);
		socket.join('presence');

		await setPresence(userId, 'available').catch(() => {});
		broadcastPresenceChange(userId, 'available');

		socket.emit('presence:init', {
			onlineUsers: Array.from(connectedUsers.keys()),
		});

		socket.on('presence:set', async (data: { status: string }) => {
			const allowed = ['available', 'busy', 'away', 'offline'];
			if (!allowed.includes(data?.status)) return;

			await setPresence(userId, data.status).catch(() => {});
			broadcastPresenceChange(userId, data.status);
		});

		socket.on('disconnect', () => {
			handleDisconnect(socket, userId).catch((err) =>
				logError(`Presence disconnect error: ${String(err)}`),
			);
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

export function getOnlineUsers(): string[] {
	return Array.from(connectedUsers.keys());
}

export function emitPresenceChange(userId: string, status: string): void {
	broadcastPresenceChange(userId, status);
}
