import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  try {
    await resend.emails.send({
      from: `WastePickup <${FROM_EMAIL}>`,
      to,
      subject: 'Reset your WastePickup password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <div style="width: 40px; height: 40px; background: #059669; border-radius: 8px; margin-bottom: 24px;"></div>
          <h1 style="color: #0f172a; font-size: 22px;">Reset your password</h1>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            We received a request to reset your WastePickup account password. Click the button below to choose a new one. This link expires in 30 minutes.
          </p>
          <a href="${resetLink}" style="display: inline-block; background: #059669; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email — your password will remain unchanged.
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send password reset email:', err);
    // Don't throw — we don't want an email delivery failure to break the reset flow
    // or leak information about whether the send succeeded to the client.
  }
}