import { StatusRegister } from '@Constants/statusRegister';
import { UserGender } from '@Constants/userGender';

export interface SubscriberSchema {
	id?: string;
	firstName: string;
	lastName: string;
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
	status?: StatusRegister;
}
