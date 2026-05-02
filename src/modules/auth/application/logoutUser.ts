import { JwtService } from '@Shared/infrastructure/JwtService';
import { emitSessionUpdate } from '@Shared/infrastructure/SocketServer';
import RefreshTokenModel from '../infrastructure/RefreshTokenModel';
import SessionModel from '../infrastructure/SessionModel';

export async function logoutUser(refreshToken: string) {
	try {
		const payload = JwtService.verifyRefresh(refreshToken);
		const stored = await RefreshTokenModel.findOne({ jti: payload.jti });

		if (stored && !stored.revokedAt) {
			await Promise.all([
				RefreshTokenModel.findOneAndUpdate(
					{ jti: payload.jti },
					{ $set: { revokedAt: new Date() } },
				),
				SessionModel.deleteOne({ userId: payload.sub }),
			]);
			emitSessionUpdate('logout', { userId: payload.sub });
		}
	} catch {
		// Token inválido o expirado — continuar con el logout de todas formas
	}
}
