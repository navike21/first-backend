import { randomUUID } from 'node:crypto';

const generateUUID = (): string => {
	return randomUUID();
};

export default generateUUID;
