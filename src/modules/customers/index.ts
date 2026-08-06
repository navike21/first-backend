export { customersApi } from './routes/route';
// Exported for `customer-auth` to read/write directly (register/login/reset
// password) — same precedent as `users` exporting `UserModel` for `auth`.
export { default as CustomerModel } from './infrastructure/CustomerModel';
