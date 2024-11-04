import { TRouter } from '../../../common'
import { verifySession } from '../../auth/middlewares'
import { uploadFiles, deleteFile, deleteMultipleFiles } from '../controllers'
import {
  deleteMultipleFiles as deleteMultipleFilesMiddleware,
  uploadFilesMiddleware
} from '../middlewares'

export function files(router: TRouter) {
  router.post(
    '/files-upload',
    verifySession,
    uploadFilesMiddleware,
    uploadFiles
  )
  router.delete('/file-delete/:idFile', verifySession, deleteFile)
  router.delete(
    '/file-delete/',
    verifySession,
    deleteMultipleFilesMiddleware,
    deleteMultipleFiles
  )
}
