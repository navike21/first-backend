import { TRouter } from '../../../common'
import { verifySession } from '../../auth/middlewares'
import { uploadFiles } from '../controllers'
import { uploadFilesMiddleware } from '../middlewares'

export function upload(router: TRouter) {
  router.post('/upload', verifySession, uploadFilesMiddleware, uploadFiles)
}
