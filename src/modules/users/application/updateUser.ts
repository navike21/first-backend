import UserModel from '../infrastructure/UserModel';
import { UpdateUserInput } from '../schemas/user.schema';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function updateUser(id: string, input: UpdateUserInput) {
	const user = await UserModel.findOne({ id });
	if (!user) throw new UserNotFoundError();

	const dateOfBirth = input.dateOfBirth
		? new Date(input.dateOfBirth)
		: undefined;
	Object.assign(user, { ...input, ...(dateOfBirth && { dateOfBirth }) });
	await user.save();

	const { password: _pwd, ...safeUser } = user.toObject();
	return safeUser;
}
