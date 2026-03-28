export function cleanMongoFields<T>(obj: T): T {
	if (obj instanceof Date) return obj;

	if (Array.isArray(obj)) {
		return obj.map((item) => cleanMongoFields(item)) as T;
	}

	if (obj !== null && typeof obj === 'object') {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(obj)) {
			if (key === '_id' || key === '__v') continue;

			result[key] = cleanMongoFields(value);
		}

		return result as T;
	}

	return obj;
}
