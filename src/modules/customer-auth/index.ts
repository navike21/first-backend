export { customerAuthApi } from './routes/route';
// Exported so `cart`/`wishlist` (next milestone) can gate their own routes
// with the same customer identity check.
export { authenticateCustomer } from './middlewares/authenticateCustomer';
