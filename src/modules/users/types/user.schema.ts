import { StatusRegister } from '@Constants/statusRegister';
import { UserGender } from '@Constants/userGender';
import { UserRoles } from '@Constants/userRole';

export interface UserSchema {
	id?: string;
	firstName: string;
	lastName: string;
	adminInformation: {
		password: string;
		role: UserRoles[];
	};
	contactInformation: {
		email: string;
		phoneNumber?: string;
		address?: string;
	};
	personalInformation: {
		profilePictureUrl?: string;
		dateOfBirth?: Date;
		gender: UserGender;
	};
	socialMediaLinks?: {
		facebook?: string;
		twitter?: string;
		linkedIn?: string;
		instagram?: string;
		x?: string;
		youTube?: string;
		website?: string;
	};
	status: StatusRegister;
}
