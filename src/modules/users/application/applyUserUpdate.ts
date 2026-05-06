import UserModel from '../infrastructure/UserModel';
import { UserNotFoundError } from '../domain/errors/UserErrors';

interface UpdateInput {
	dateOfBirth?: string;
	[key: string]: unknown;
}

export async function applyUserUpdate(id: string, input: UpdateInput) {
	const user = await UserModel.findOne({ id });
	if (!user) throw new UserNotFoundError();

	const dateOfBirth = input.dateOfBirth ? new Date(input.dateOfBirth) : undefined;
	Object.assign(user, { ...input, ...(dateOfBirth && { dateOfBirth }) });
	await user.save();

	const { password: _pwd, ...safeUser } = user.toObject();
	return safeUser;
}
