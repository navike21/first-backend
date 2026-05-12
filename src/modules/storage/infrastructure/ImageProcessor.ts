import sharp from 'sharp';

export interface ImageVariants {
	full: Buffer;
	thumb: Buffer;
}

const FULL_MAX_PX = 2000;
const THUMB_PX = 700;

export async function processRasterImage(
	buffer: Buffer,
	quality: number,
): Promise<ImageVariants> {
	const [full, thumb] = await Promise.all([
		sharp(buffer)
			.resize(FULL_MAX_PX, FULL_MAX_PX, {
				fit: 'inside',
				withoutEnlargement: true,
			})
			.webp({ quality })
			.toBuffer(),
		sharp(buffer)
			.resize(THUMB_PX, THUMB_PX, { fit: 'cover', position: 'centre' })
			.webp({ quality })
			.toBuffer(),
	]);

	return { full, thumb };
}
