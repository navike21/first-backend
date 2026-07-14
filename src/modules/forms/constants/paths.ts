export const FORMS_PATH_LIST = '/forms';
export const FORMS_PATH_CREATE = '/forms';
export const FORMS_PATH_TRASH = '/forms/trash';
export const FORMS_PATH_BULK_DELETE = '/forms/bulk';
export const FORMS_PATH_BULK_RESTORE = '/forms/bulk/restore';
export const FORMS_PATH_BULK_PURGE = '/forms/bulk/permanent';
export const FORMS_PATH_GET_BY_ID_PUBLIC = '/forms/public/:id';
export const FORMS_PATH_GET_BY_ID = '/forms/:id';
export const FORMS_PATH_UPDATE = '/forms/:id';
export const FORMS_PATH_DELETE = '/forms/:id';
export const FORMS_PATH_RESTORE = '/forms/:id/restore';
export const FORMS_PATH_PURGE = '/forms/:id/permanent';

// Submissions — nested under a form. `trash`/`bulk*` are the SAME arity as
// `/forms/:id/submissions/:submissionId` (one segment deeper than the
// top-level forms routes), so they must be registered first, exactly like
// every other module's `trash`/`bulk` vs `:id` ordering — just one level in.
export const FORMS_PATH_SUBMIT_PUBLIC = '/forms/:id/submissions';
export const FORMS_PATH_SUBMISSIONS_LIST = '/forms/:id/submissions';
export const FORMS_PATH_SUBMISSIONS_TRASH = '/forms/:id/submissions/trash';
export const FORMS_PATH_SUBMISSIONS_BULK_DELETE = '/forms/:id/submissions/bulk';
export const FORMS_PATH_SUBMISSIONS_BULK_RESTORE =
	'/forms/:id/submissions/bulk/restore';
export const FORMS_PATH_SUBMISSIONS_BULK_PURGE =
	'/forms/:id/submissions/bulk/permanent';
export const FORMS_PATH_SUBMISSION_GET_BY_ID =
	'/forms/:id/submissions/:submissionId';
export const FORMS_PATH_SUBMISSION_MARK_READ =
	'/forms/:id/submissions/:submissionId/read';
export const FORMS_PATH_SUBMISSION_DELETE =
	'/forms/:id/submissions/:submissionId';
export const FORMS_PATH_SUBMISSION_RESTORE =
	'/forms/:id/submissions/:submissionId/restore';
export const FORMS_PATH_SUBMISSION_PURGE =
	'/forms/:id/submissions/:submissionId/permanent';

export const FORM_ENTITY_TYPE = 'forms';
