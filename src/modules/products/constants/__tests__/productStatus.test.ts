import { describe, it, expect } from 'vitest';
import {
	PRODUCT_STATUSES,
	PRODUCT_STATUSES_ARRAY,
} from '@Modules/products/constants/productStatus';

describe('PRODUCT_STATUSES', () => {
	it('has the expected statuses', () => {
		expect(PRODUCT_STATUSES).toEqual(['draft', 'active', 'archived']);
	});

	it('PRODUCT_STATUSES_ARRAY mirrors PRODUCT_STATUSES', () => {
		expect(PRODUCT_STATUSES_ARRAY).toEqual([...PRODUCT_STATUSES]);
	});
});
