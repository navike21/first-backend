export { inventoryApi } from './routes/route';
// Exported so `cart` (next milestone) can validate requested quantities
// against real stock before accepting an item.
export { getStockByProduct } from './application/getStockByProduct';
export type { StockSummary, StockByLocation } from './application/getStockByProduct';
