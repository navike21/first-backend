import { isValid } from 'date-fns';

export const dateValidate = (date: Date): boolean => {
	if (!date) return true; // Allow empty value
	return isValid(date);
};
