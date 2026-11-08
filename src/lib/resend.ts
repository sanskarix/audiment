import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('[Resend] Warning: RESEND_API_KEY is not defined in environment variables.');
}

export const resend = new Resend(resendApiKey);

export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Audiment <onboarding@resend.dev>';
export const FOUNDER_ALERT_EMAIL = process.env.FOUNDER_ALERT_EMAIL || 'hello@audiment.in';

/**
 * Send a 6-digit OTP verification email to a newly registering user.
 */
export async function sendVerificationOtpEmail({
  to,
  fullName,
  otpCode,
}: {
  to: string;
  fullName: string;
  otpCode: string;
}) {
  const firstName = fullName.split(' ')[0] || 'there';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Audiment Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d0e; color: #f4f4f5; margin: 0; padding: 40px 20px;">
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #16181a; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <!-- Header -->
    <tr>
      <td style="padding: 32px 32px 16px 32px; border-bottom: 1px solid #27272a;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff;">
                <span style="color: #3b82f6;">◆</span> AUDIMENT
              </div>
            </td>
            <td align="right">
              <span style="background-color: #27272a; color: #a1a1aa; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 8px; border-radius: 6px;">
                Workspace Activation
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- Content -->
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 16px; line-height: 24px; color: #e4e4e7; margin: 0 0 16px 0;">
          Hi <strong>${firstName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 22px; color: #a1a1aa; margin: 0 0 28px 0;">
          Thank you for claiming an early access slot for Audiment. Use the verification code below to confirm your email and activate your workspace:
        </p>

        <!-- Code Box -->
        <div style="background-color: #090a0b; border: 1px solid #3f3f46; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 28px 0;">
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #60a5fa; text-shadow: 0 0 12px rgba(96,165,250,0.3);">
            ${otpCode}
          </div>
          <div style="font-size: 11px; color: #71717a; margin-top: 8px; letter-spacing: 0.3px;">
            Valid for 15 minutes • Do not share this code
          </div>
        </div>

        <p style="font-size: 13px; line-height: 20px; color: #71717a; margin: 0;">
          If you did not attempt to sign up for Audiment, please ignore this email. No account has been created yet.
        </p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #0f1011; border-top: 1px solid #27272a; text-align: center;">
        <p style="font-size: 12px; color: #52525b; margin: 0;">
          Audiment • High-Trust Compliance & Audit Operations
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: [to],
    subject: `${otpCode} is your Audiment verification code`,
    html,
  });
}

/**
 * Send an alert email to the founder whenever a new free workspace is registered.
 */
export async function sendFounderSignupAlertEmail({
  fullName,
  companyName,
  email,
  phone,
  industry,
  orgId,
  freeAccountCount,
  maxCap,
}: {
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  industry?: string;
  orgId: string;
  freeAccountCount: number;
  maxCap: number;
}) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 20px;">
  <div style="max-width: 560px; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; margin: 0 auto;">
    <h2 style="color: #09090b; margin-top: 0;">🚨 New Free Workspace Created</h2>
    <p style="color: #52525b; font-size: 14px;">A new user has completed onboarding and provisioned their Free Tier account.</p>
    
    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 14px; margin: 20px 0; font-size: 14px; line-height: 22px;">
      <div><strong>Company / Brand:</strong> ${companyName}</div>
      <div><strong>Full Name:</strong> ${fullName}</div>
      <div><strong>Work Email:</strong> <a href="mailto:${email}">${email}</a></div>
      <div><strong>Phone Number:</strong> ${phone || 'Not provided'}</div>
      <div><strong>Industry:</strong> ${industry || 'Not specified'}</div>
      <div><strong>Organization ID:</strong> <code>${orgId}</code></div>
      <div><strong>Timestamp:</strong> ${new Date().toUTCString()}</div>
    </div>

    <div style="padding: 12px; background-color: #eff6ff; border-radius: 6px; font-size: 13px; color: #1e40af;">
      <strong>Free Accounts Claimed:</strong> ${freeAccountCount} of ${maxCap} slots (${maxCap - freeAccountCount} slots remaining).
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    return await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: [FOUNDER_ALERT_EMAIL],
      subject: `🚨 New Free Workspace: ${companyName} (${fullName}) [${freeAccountCount}/${maxCap}]`,
      html,
    });
  } catch (err) {
    console.error('[Resend] Failed to send founder alert email:', err);
    return null;
  }
}
