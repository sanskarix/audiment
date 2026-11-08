import { Resend } from 'resend';

let _resendInstance: Resend | null = null;

/**
 * Returns the Resend singleton client, or null if RESEND_API_KEY is not defined.
 * Lazily initialized to prevent Next.js build-time crashes during module evaluation.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!_resendInstance) {
    _resendInstance = new Resend(apiKey);
  }
  return _resendInstance;
}

/**
 * Resend proxy that delegates to getResendClient() at runtime,
 * safely avoiding module-evaluation instantiation errors during build time.
 */
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResendClient();
    if (!client) {
      console.warn('[Resend] Warning: RESEND_API_KEY is not defined in environment variables.');
      if (prop === 'emails') {
        return {
          send: async () => ({
            data: null,
            error: new Error('RESEND_API_KEY is not configured in environment variables.')
          })
        };
      }
      return undefined;
    }
    return (client as any)[prop];
  }
});

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
  const client = getResendClient();
  if (!client) {
    console.warn('[Resend] Skipping email delivery: RESEND_API_KEY is not configured in environment variables.');
    return {
      data: null,
      error: {
        message: 'Email delivery service is temporarily unconfigured (missing RESEND_API_KEY).',
      }
    };
  }

  const firstName = fullName.split(' ')[0] || 'there';

  const html = `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>Your Audiment Verification Code</title>
    <style>
      :root {
        color-scheme: light only;
        supported-color-schemes: light only;
      }
    </style>
  </head>
  <body
    style="margin: 0; padding: 48px 16px; background-color: #FAFAFA; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #181818;"
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width: 520px; margin: 0 auto;"
    >
      <tr>
        <td>
          <!-- Top Architectural Accent Bar -->
          <div
            style="height: 3px; background-color: #FF5400; border-top-left-radius: 14px; border-top-right-radius: 14px;"
          ></div>

          <!-- Main Card -->
          <table
            width="100%"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="background-color: #ffffff; border-left: 1px solid #e8e8e8; border-right: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8; border-bottom-left-radius: 14px; border-bottom-right-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);"
          >
            <!-- Header -->
            <tr>
              <td style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #e8e8e8;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="vertical-align: middle;">
                      <span
                        style="font-size: 28px; font-weight: 180; letter-spacing: 0rem; color: #181818; display: inline-block;"
                        >Audiment</span
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 36px 32px 32px 32px;">
                <h1
                  style="font-size: 18px; font-weight: 400; letter-spacing: -0.035em; color: #181818; margin: 0 0 14px 0; line-height: 1.25;"
                >
                  Hi \${firstName},
                </h1>
                <p style="font-size: 14.5px; line-height: 23px; color: #45474d; margin: 0 0 28px 0;">
                  Thanks for choosing Audiment. Use the verification code below to activate your workspace:
                </p>

                <!-- Code Container -->
                <div
                  style="background-color: #FAFAFA; border: 1px solid #e8e8e8; border-radius: 10px; padding: 24px 20px; text-align: center; margin: 0 0 28px 0;"
                >
                  <div
                    style="font-family: 'Geist Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace; font-size: 34px; font-weight: 600; letter-spacing: 10px; color: #181818; margin: 0; padding-left: 10px;"
                  >
                    \${otpCode}
                  </div>
                </div>

                <!-- Security Disclaimer -->
                <p style="font-size: 12.5px; line-height: 20px; color: #737373; margin: 0;">
                  The code is valid for 15 minutes. If you did not attempt to sign up, please disregard this email. No
                  workspace has been created yet.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="padding: 22px 32px; background-color: #FAFAFA; border-top: 1px solid #e8e8e8; text-align: center;"
              >
                <p style="font-size: 12px; color: #737373; margin: 0; letter-spacing: -0.01em;">
                  Audits and Inspections with Proof
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return await client.emails.send({
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
  const client = getResendClient();
  if (!client) {
    console.warn('[Resend] Skipping founder alert: RESEND_API_KEY is not configured in environment variables.');
    return null;
  }

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
    return await client.emails.send({
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
