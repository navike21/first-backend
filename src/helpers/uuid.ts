import { v4 as uuid } from 'uuid';

const generateUUID = (): string => {
	return uuid();
};

export default generateUUID;
