import UserModel from '../infrastructure/UserModel';
import { UpdateMyProfileInput } from '../schemas/user.schema';
import { UserNotFoundError } from '../domain/errors/UserErrors';

export async function updateMyProfile(
	userId: string,
	input: UpdateMyProfileInput,
) {
	const user = await UserModel.findOne({ id: userId });
	if (!user) throw new UserNotFoundError();

	const dateOfBirth = input.dateOfBirth
		? new Date(input.dateOfBirth)
		: undefined;
	Object.assign(user, { ...input, ...(dateOfBirth && { dateOfBirth }) });
	await user.save();

	const { password: _pwd, ...safeUser } = user.toObject();
	return safeUser;
}
