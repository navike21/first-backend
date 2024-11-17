import { TRouter } from '../../../common'
import { verifySession } from '../../auth/middlewares'
import {
  uploadFiles,
  deleteFile,
  deleteMultipleFiles,
  listAllFiles
} from '../controllers'
import {
  deleteMultipleFiles as deleteMultipleFilesMiddleware,
  uploadFilesMiddleware
} from '../middlewares'

export function files(router: TRouter) {
  router.post('/files/list-filter', verifySession, listAllFiles)
  router.post(
    '/files/upload',
    verifySession,
    uploadFilesMiddleware,
    uploadFiles
  )
  router.delete('/files/delete/:idFile', verifySession, deleteFile)
  router.delete(
    '/files/delete/',
    verifySession,
    deleteMultipleFilesMiddleware,
    deleteMultipleFiles
  )
}
