import { USER_ROLES } from '@Constants/userRole';

export interface UserSchema {
	id: string;
	firstName: string;
	lastName: string;
	adminInformation: {
		password: string;
		role: USER_ROLES[];
	};
	contactInformation: {
		email: string;
		phoneNumber?: string;
		address?: string;
	};
	personalInformation: {
		profilePictureUrl?: string;
		dateOfBirth?: Date;
		gender: 'male' | 'female';
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
}
