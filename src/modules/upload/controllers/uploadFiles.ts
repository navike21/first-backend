import { generateId, TRequest, TResponse } from '../../../common'
import { FileModel } from '../models'
import { IExtendedFile, IFile } from '../types'

export const uploadFiles = async (req: TRequest, res: TResponse) => {
  const files = req.files as IExtendedFile[]

  try {
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' })
    }

    const savedFiles = await Promise.all(
      files.map(async (file): Promise<IFile> => {
        const fileData: IFile = new FileModel({
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          idFile: generateId(),
          webpPath: file.webpPath || null,
          thumbnails: file.thumbnails || []
        })

        const savedFile = await fileData.save()

        return savedFile.toObject()
      })
    )

    res.status(201).json({ data: savedFiles })
  } catch (error) {
    const { message } = error as Error
    res.status(500).json({ message: 'Error uploading files', error: message })
  }
}
