interface PasswordResetData {
	firstName: string;
	resetUrl: string;
}

export function passwordResetTemplate({
	firstName,
	resetUrl,
}: PasswordResetData) {
	return {
		subject: 'Reset your password',
		html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">
        <tr><td style="background:#111827;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">First Backend</h1>
        </td></tr>
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Hi ${firstName},</h2>
          <p style="margin:0 0 24px;color:#6b7280;line-height:1.6;">
            We received a request to reset your password. Click the button below to create a new one. This link expires in 1 hour.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="background:#dc2626;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:600;font-size:15px;display:inline-block;">
              Reset Password
            </a>
          </div>
          <p style="margin:24px 0 0;color:#9ca3af;font-size:13px;">
            If you didn't request a password reset, you can safely ignore this email. Your password won't change.
          </p>
        </td></tr>
        <tr><td style="padding:24px 40px;background:#f9fafb;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} First Backend. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
	};
}
