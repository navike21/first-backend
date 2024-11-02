import fs from 'fs'
import path from 'path'
import { UPLOADS_DIR } from '../constants'

export const createFilePath = (fileTypeDir: string) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const dirPath = path.join(
    UPLOADS_DIR,
    fileTypeDir,
    year.toString(),
    month,
    day
  )
  fs.mkdirSync(dirPath, { recursive: true })
  return dirPath
}
