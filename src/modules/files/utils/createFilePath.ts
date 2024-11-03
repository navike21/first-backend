import fs from 'fs'
import path from 'path'
import { UPLOADS_DIR } from '../constants'

export const createFilePath = (fileTypeDir: string) => {
  const today = new Date()
  const year = today.getFullYear().toString()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const dirPath = path.join(UPLOADS_DIR, fileTypeDir, year, month, day)

  const createDirAndIndex = (currentPath: string) => {
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath, { recursive: true })
    }
    const indexPath = path.join(currentPath, 'index.html')
    if (!fs.existsSync(indexPath)) {
      fs.writeFileSync(indexPath, '')
    }

    const parentPath = path.dirname(currentPath)
    if (parentPath !== currentPath && parentPath.startsWith(UPLOADS_DIR)) {
      createDirAndIndex(parentPath) // Llamada recursiva al nivel superior
    }
  }
  createDirAndIndex(dirPath)
  return dirPath
}
