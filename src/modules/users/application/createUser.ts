import generateUUID from '@Helpers/uuid';
import { HashedPassword } from '@Modules/auth/domain/value-objects/HashedPassword';
import { ENV } from '@Constants/environments';
import { JwtService } from '@Shared/infrastructure/JwtService';
import { eventBus } from '@Shared/infrastructure/EventBus';
import { UserRegisteredEvent } from '@Shared/events/emailEvents';
import { uploadImageSafe, deleteEntityFiles } from '@Modules/storage';
import type { IncomingFile } from '@Types/incomingFile';
import type { MutationResult, ResponseWarning } from '@Types/responseStructure';
import UserModel from '@Modules/users/infrastructure/UserModel';
import { EmailAlreadyExistsError } from '../domain/errors/UserErrors';
import { USER_ENTITY_TYPE } from '../constants/entity';
import { CreateUserInput } from '../schemas/user.schema';

interface CreatedUser {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	profilePictureUrl?: string;
}

export async function createUser(
	input: CreateUserInput,
	lang = 'en',
	file?: IncomingFile,
	uploadedBy?: string,
): Promise<MutationResult<CreatedUser>> {
	const existing = await UserModel.findOne({ email: input.email });
	if (existing) throw new EmailAlreadyExistsError();

	const hashedPassword = await HashedPassword.hash(input.password);
	const dateOfBirth = input.dateOfBirth
		? new Date(input.dateOfBirth)
		: undefined;
	const id = generateUUID();
	let profilePictureUrl = input.profilePictureUrl;
	const warnings: ResponseWarning[] = [];

	if (file) {
		const uploaded = await uploadImageSafe({
			buffer: file.buffer,
			originalName: file.originalName,
			mimeType: file.mimeType,
			entityType: USER_ENTITY_TYPE,
			entityId: id,
			field: 'avatar',
			uploadedBy,
		});
		if (uploaded.url) profilePictureUrl = uploaded.url;
		if (uploaded.warning) warnings.push(uploaded.warning);
	}

	let user;
	try {
		user = await UserModel.create({
			...input,
			id,
			password: hashedPassword,
			dateOfBirth,
			profilePictureUrl,
		});
	} catch (error) {
		if (file) await deleteEntityFiles(USER_ENTITY_TYPE, id).catch(() => {});
		throw error;
	}

	const token = JwtService.signEmail({
		sub: user.id,
		type: 'email_verification',
	});
	const verificationUrl = `${ENV.CLIENT_URL}/verify-email?token=${token}`;

	// Email is sent by the notifications-email subscriber (non-blocking): a SMTP
	// failure no longer fails user creation.
	await eventBus.publish(
		new UserRegisteredEvent(user.email, user.firstName, verificationUrl, lang),
	);

	return {
		data: {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			profilePictureUrl: user.profilePictureUrl,
		},
		warnings,
	};
}
