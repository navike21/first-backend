import { TFilesMessage } from '../../types'

export const filesMessagesEn: TFilesMessage = {
  files: {
    error: {
      uploadFailed: 'Error uploading files',
      unexpectedError: 'Unexpected error',
      deletionFailed: 'Error deleting files'
    },
    success: {
      completed: 'Files uploaded successfully',
      list: 'Files listed successfully',
      deleted: 'Files deleted successfully'
    },
    warning: {
      notFound: 'Files not found',
      notFoundToDelete: 'No files found to delete',
      notDeleted: 'Files could not be deleted',
      notRetrieved: 'Files could not be retrieved',
      notFoundSearch: 'No files found matching search criteria',
      notMore: 'No more files to display'
    }
  },
  file: {
    error: {
      deletionFailed: 'Error deleting file'
    },
    success: {
      deleted: 'File deleted successfully'
    },
    warning: {
      notFound: 'File not found',
      notDeleted: 'File could not be deleted',
      notRetrieved: 'File could not be retrieved',
      notMatch: 'File type not allowed'
    }
  },
  validation: {
    idFiles: {
      isRequired: 'File ID is required',
      isString: 'File ID must be a string',
      isArray: 'File ID must be an array'
    }
  }
}
