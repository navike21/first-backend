import path from 'path'
import sharp from 'sharp'
import {
  IMAGE_CONVERTED_DIR,
  IMAGE_THUMB_DIR,
  thumbnailSizes
} from '../constants'
import { IThumbnail } from '../types'
import { createFilePath } from './createFilePath'

export const createThumbnailsAndConverted = async (
  filePath: string,
  fileName: string
): Promise<{ webpPath: string; thumbnails: IThumbnail[] }> => {
  const thumbPath = createFilePath(path.join('images', IMAGE_THUMB_DIR))
  const convertedPath = createFilePath(IMAGE_CONVERTED_DIR)
  const thumbnails: IThumbnail[] = []

  for (const { width, suffix } of thumbnailSizes) {
    const thumbName = `${fileName.split('.')[0]}${suffix}.webp`
    const thumbFullPath = path.join(thumbPath, thumbName)

    await sharp(filePath)
      .resize({ width })
      .toFormat('webp')
      .toFile(thumbFullPath)

    thumbnails.push({
      size: suffix.replace('_', ''),
      path: thumbFullPath.replace(/\\/g, '/')
    })
  }

  const convertedName = `${fileName.split('.')[0]}.webp`
  const convertedFullPath = path.join(convertedPath, convertedName)

  await sharp(filePath).toFormat('webp').toFile(convertedFullPath)

  return {
    webpPath: convertedFullPath.replace(/\\/g, '/'),
    thumbnails
  }
}
