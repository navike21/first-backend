export { shippingApi } from './routes/route';
// Exported so `orders` (Milestone E) can compute the shipping cost for a
// cart/address at order-creation time — the only intended external caller.
export { calculateShippingCost } from './application/calculateShippingCost';
export type {
	CalculateShippingCostInput,
	CalculateShippingCostResult,
} from './application/calculateShippingCost';
