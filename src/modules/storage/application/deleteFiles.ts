import { getStorageDriver } from '../infrastructure/StorageService';

export async function deleteFiles(urls: string[]): Promise<void> {
	const driver = getStorageDriver();
	await Promise.all(urls.map((url) => driver.delete(url)));
}
