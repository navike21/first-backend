import { UserGender } from '@Constants/userGender';

export interface SubscriberLocation {
	countryCode?: string;
	ubigeoCode?: string;
	region?: string;
	province?: string;
	district?: string;
	address?: string;
	addressNumber?: string;
	addressInterior?: string;
}

export interface SubscriberSchema {
	id?: string;
	firstName: string;
	lastName: string;
	contactInformation: {
		email: string;
		phoneNumber?: string;
	};
	location?: SubscriberLocation;
	personalInformation: {
		profilePictureUrl?: string;
		dateOfBirth?: Date;
		gender: UserGender;
	};
	status?: string;
	deletedAt?: Date | null;
}
