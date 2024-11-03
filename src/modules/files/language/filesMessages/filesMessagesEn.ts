import { IFilesMessage } from '../../types'

export const filesMessagesEn: IFilesMessage = {
  files: {
    error: {
      uploadFailed: 'File upload failed',
      uploadsFailed: 'Files upload failed',
      unexpectedError: 'Unexpected error during files upload',
      deletionFailed: 'Error deleting the file'
    },
    success: {
      completed: 'Files uploaded successfully',
      list: 'File list retrieved successfully',
      found: 'File found successfully',
      retrieved: 'File retrieved successfully'
    },
    warning: {
      notFound: 'No files found to upload to the server',
      notDeleted: 'Files could not be deleted',
      notRetrieved: 'File could not be retrieved',
      notFoundSearch: 'No files found with the search criteria',
      notMore: 'No more files to display',
      notMatch: 'File type not allowed'
    }
  }
}
