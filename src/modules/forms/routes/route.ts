import { Router } from 'express';
import { authenticate } from '@Modules/auth/middlewares/authenticate';
import { authorize } from '@Modules/auth/middlewares/authorize';
import { PERMISSIONS } from '@Constants/permissions';
import { captureAudit } from '@Modules/audit-log/middlewares/captureAudit';
import { AUDIT_ACTIONS } from '@Modules/audit-log/constants/auditActions';
import { formSubmissionLimiter } from '@Config/limiter';
import {
	FORMS_PATH_LIST,
	FORMS_PATH_CREATE,
	FORMS_PATH_TRASH,
	FORMS_PATH_BULK_DELETE,
	FORMS_PATH_BULK_RESTORE,
	FORMS_PATH_BULK_PURGE,
	FORMS_PATH_GET_BY_ID_PUBLIC,
	FORMS_PATH_GET_BY_ID,
	FORMS_PATH_UPDATE,
	FORMS_PATH_DELETE,
	FORMS_PATH_RESTORE,
	FORMS_PATH_PURGE,
	FORMS_PATH_SUBMIT_PUBLIC,
	FORMS_PATH_SUBMISSIONS_LIST,
	FORMS_PATH_SUBMISSIONS_TRASH,
	FORMS_PATH_SUBMISSIONS_BULK_DELETE,
	FORMS_PATH_SUBMISSIONS_BULK_RESTORE,
	FORMS_PATH_SUBMISSIONS_BULK_PURGE,
	FORMS_PATH_SUBMISSION_GET_BY_ID,
	FORMS_PATH_SUBMISSION_MARK_READ,
	FORMS_PATH_SUBMISSION_DELETE,
	FORMS_PATH_SUBMISSION_RESTORE,
	FORMS_PATH_SUBMISSION_PURGE,
} from '../constants/paths';
import { formGetByIdPublicController } from '../controllers/form.getByIdPublic';
import { formSubmissionSubmitController } from '../controllers/formSubmission.submit';
import { formTrashController } from '../controllers/form.trash';
import { formListController } from '../controllers/form.list';
import { formGetByIdController } from '../controllers/form.getById';
import { formCreateController } from '../controllers/form.create';
import { formUpdateController } from '../controllers/form.update';
import { formDeleteController } from '../controllers/form.delete';
import { formRestoreController } from '../controllers/form.restore';
import { formPurgeController } from '../controllers/form.purge';
import { deleteFormsBulkController } from '../controllers/form.deleteBulk';
import { restoreFormsBulkController } from '../controllers/form.restoreBulk';
import { purgeFormsBulkController } from '../controllers/form.purgeBulk';
import { formSubmissionTrashController } from '../controllers/formSubmission.trash';
import { formSubmissionListController } from '../controllers/formSubmission.list';
import { formSubmissionGetByIdController } from '../controllers/formSubmission.getById';
import { formSubmissionMarkReadController } from '../controllers/formSubmission.markRead';
import { formSubmissionDeleteController } from '../controllers/formSubmission.delete';
import { formSubmissionRestoreController } from '../controllers/formSubmission.restore';
import { formSubmissionPurgeController } from '../controllers/formSubmission.purge';
import { deleteFormSubmissionsBulkController } from '../controllers/formSubmission.deleteBulk';
import { restoreFormSubmissionsBulkController } from '../controllers/formSubmission.restoreBulk';
import { purgeFormSubmissionsBulkController } from '../controllers/formSubmission.purgeBulk';

export function formsApi(router: Router) {
	// Public
	router.get(FORMS_PATH_GET_BY_ID_PUBLIC, formGetByIdPublicController);
	router.post(
		FORMS_PATH_SUBMIT_PUBLIC,
		formSubmissionLimiter,
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_RECEIVED,
			resource: 'forms',
		}),
		formSubmissionSubmitController,
	);

	// Admin — trash/bulk BEFORE :id routes (same arity conflict every other
	// module already solves)
	router.get(
		FORMS_PATH_TRASH,
		authenticate,
		authorize(PERMISSIONS.FORMS_READ, PERMISSIONS.FORMS_MANAGE),
		formTrashController,
	);
	router.delete(
		FORMS_PATH_BULK_DELETE,
		authenticate,
		authorize(PERMISSIONS.FORMS_DELETE, PERMISSIONS.FORMS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.FORMS_BULK_SOFT_DELETED,
			resource: 'forms',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		deleteFormsBulkController,
	);
	router.patch(
		FORMS_PATH_BULK_RESTORE,
		authenticate,
		authorize(PERMISSIONS.FORMS_UPDATE, PERMISSIONS.FORMS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.FORMS_BULK_RESTORED,
			resource: 'forms',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		restoreFormsBulkController,
	);
	router.delete(
		FORMS_PATH_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.FORMS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.FORMS_BULK_PERMANENTLY_DELETED,
			resource: 'forms',
			getMetadata: (req) => ({ ids: req.body.ids }),
		}),
		purgeFormsBulkController,
	);

	// Submissions — nested under a form. `trash`/`bulk*` (4-segment paths)
	// registered BEFORE `:submissionId` (also 4 segments) for the same reason.
	router.get(
		FORMS_PATH_SUBMISSIONS_TRASH,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_READ,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		formSubmissionTrashController,
	);
	router.delete(
		FORMS_PATH_SUBMISSIONS_BULK_DELETE,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_DELETE,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_BULK_SOFT_DELETED,
			resource: 'forms',
			getMetadata: (req) => ({ formId: req.params.id, ids: req.body.ids }),
		}),
		deleteFormSubmissionsBulkController,
	);
	router.patch(
		FORMS_PATH_SUBMISSIONS_BULK_RESTORE,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_DELETE,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_BULK_RESTORED,
			resource: 'forms',
			getMetadata: (req) => ({ formId: req.params.id, ids: req.body.ids }),
		}),
		restoreFormSubmissionsBulkController,
	);
	router.delete(
		FORMS_PATH_SUBMISSIONS_BULK_PURGE,
		authenticate,
		authorize(PERMISSIONS.FORMS_SUBMISSIONS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_BULK_PERMANENTLY_DELETED,
			resource: 'forms',
			getMetadata: (req) => ({ formId: req.params.id, ids: req.body.ids }),
		}),
		purgeFormSubmissionsBulkController,
	);
	router.get(
		FORMS_PATH_SUBMISSIONS_LIST,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_READ,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		formSubmissionListController,
	);
	router.get(
		FORMS_PATH_SUBMISSION_GET_BY_ID,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_READ,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		formSubmissionGetByIdController,
	);
	router.patch(
		FORMS_PATH_SUBMISSION_MARK_READ,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_READ,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_MARKED_READ,
			resource: 'forms',
			getResourceId: (req) =>
				typeof req.params.submissionId === 'string'
					? req.params.submissionId
					: undefined,
		}),
		formSubmissionMarkReadController,
	);
	router.patch(
		FORMS_PATH_SUBMISSION_RESTORE,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_DELETE,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_RESTORED,
			resource: 'forms',
			getResourceId: (req) =>
				typeof req.params.submissionId === 'string'
					? req.params.submissionId
					: undefined,
		}),
		formSubmissionRestoreController,
	);
	router.delete(
		FORMS_PATH_SUBMISSION_PURGE,
		authenticate,
		authorize(PERMISSIONS.FORMS_SUBMISSIONS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_PERMANENTLY_DELETED,
			resource: 'forms',
			getResourceId: (req) =>
				typeof req.params.submissionId === 'string'
					? req.params.submissionId
					: undefined,
		}),
		formSubmissionPurgeController,
	);
	router.delete(
		FORMS_PATH_SUBMISSION_DELETE,
		authenticate,
		authorize(
			PERMISSIONS.FORMS_SUBMISSIONS_DELETE,
			PERMISSIONS.FORMS_SUBMISSIONS_MANAGE,
		),
		captureAudit({
			action: AUDIT_ACTIONS.FORM_SUBMISSION_SOFT_DELETED,
			resource: 'forms',
			getResourceId: (req) =>
				typeof req.params.submissionId === 'string'
					? req.params.submissionId
					: undefined,
		}),
		formSubmissionDeleteController,
	);

	// Admin — forms CRUD
	router.get(
		FORMS_PATH_LIST,
		authenticate,
		authorize(PERMISSIONS.FORMS_READ, PERMISSIONS.FORMS_MANAGE),
		formListController,
	);
	router.post(
		FORMS_PATH_CREATE,
		authenticate,
		authorize(PERMISSIONS.FORMS_CREATE, PERMISSIONS.FORMS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.FORMS_CREATED, resource: 'forms' }),
		formCreateController,
	);
	router.get(
		FORMS_PATH_GET_BY_ID,
		authenticate,
		authorize(PERMISSIONS.FORMS_READ, PERMISSIONS.FORMS_MANAGE),
		formGetByIdController,
	);
	router.patch(
		FORMS_PATH_RESTORE,
		authenticate,
		authorize(PERMISSIONS.FORMS_UPDATE, PERMISSIONS.FORMS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.FORMS_RESTORED, resource: 'forms' }),
		formRestoreController,
	);
	router.patch(
		FORMS_PATH_UPDATE,
		authenticate,
		authorize(PERMISSIONS.FORMS_UPDATE, PERMISSIONS.FORMS_MANAGE),
		captureAudit({ action: AUDIT_ACTIONS.FORMS_UPDATED, resource: 'forms' }),
		formUpdateController,
	);
	router.delete(
		FORMS_PATH_PURGE,
		authenticate,
		authorize(PERMISSIONS.FORMS_PURGE),
		captureAudit({
			action: AUDIT_ACTIONS.FORMS_PERMANENTLY_DELETED,
			resource: 'forms',
		}),
		formPurgeController,
	);
	router.delete(
		FORMS_PATH_DELETE,
		authenticate,
		authorize(PERMISSIONS.FORMS_DELETE, PERMISSIONS.FORMS_MANAGE),
		captureAudit({
			action: AUDIT_ACTIONS.FORMS_SOFT_DELETED,
			resource: 'forms',
		}),
		formDeleteController,
	);
}
