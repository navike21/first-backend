import { asyncHandler } from '@Middlewares/asyncHandler';
import { requestDirectUpload } from '../application/directUpload';

// `@vercel/blob/client`'s `upload()` on the frontend parses the response body
// directly as `{clientToken}` / `{response:'ok'}` — it does NOT go through our
// own successResponse envelope, since that shape is dictated by the SDK, not
// by this API's conventions.
export const storageDirectUploadController = asyncHandler(async (req, res) => {
	const result = await requestDirectUpload(req);
	res.status(200).json(result);
});
