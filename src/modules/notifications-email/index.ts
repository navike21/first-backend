// API pública del módulo. `enqueueEmail` es la función agnóstica que cualquier
// otro módulo invoca para mandar un correo (durable, vía outbox).
export { enqueueEmail } from './application/enqueueEmail';
export { dispatchPendingEmails } from './application/dispatchOutbox';
export { registerEmailSubscribers } from './application/registerEmailSubscribers';
export { notificationsEmailApi } from './routes/route';
export { verifyEmailTemplate } from './templates/verifyEmail.template';
export { welcomeEmailTemplate } from './templates/welcomeEmail.template';
export { passwordResetTemplate } from './templates/passwordReset.template';
