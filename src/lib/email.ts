// Email utility functions using Resend
// Sign up for free at https://resend.com

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const ADMIN_EMAILS = (import.meta.env.ADMIN_EMAILS || '').split(',').map((e: string) => e.trim()).filter(Boolean);
const FROM_EMAIL = import.meta.env.FROM_EMAIL || 'noreply@resend.dev';

interface AccessRequestEmailParams {
  userEmail: string;
  postTitle: string;
  documentId: string;
  message?: string;
  adminUrl: string;
}

interface AccessGrantedEmailParams {
  userEmail: string;
  postTitle: string;
  postUrl: string;
}

export async function sendAccessGrantedEmail(params: AccessGrantedEmailParams): Promise<boolean> {
  const { userEmail, postTitle, postUrl } = params;

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email notification');
    return false;
  }

  const subject = `Access Granted: ${postTitle}`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Access Granted!</h2>

      <p>Great news! Your request to access the following article has been approved:</p>

      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">${postTitle}</h3>
      </div>

      <p>
        <a href="${postUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Read Article
        </a>
      </p>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        You can now access the full content of this article at any time.
      </p>
    </div>
  `;

  const textContent = `
Access Granted!

Great news! Your request to access the following article has been approved:

${postTitle}

Read the article here: ${postUrl}
  `.trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: userEmail,
        subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send access granted email:', error);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error sending access granted email:', error);
    return false;
  }
}

export async function sendAccessRequestEmail(params: AccessRequestEmailParams): Promise<boolean> {
  const { userEmail, postTitle, documentId, message, adminUrl } = params;

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email notification');
    return false;
  }

  if (ADMIN_EMAILS.length === 0) {
    console.warn('No ADMIN_EMAILS configured - skipping email notification');
    return false;
  }

  const subject = `Access Request: ${postTitle}`;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">New Access Request</h2>

      <p>A user has requested access to protected content:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">User Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Article:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${postTitle}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Document ID:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 12px;">${documentId}</td>
        </tr>
        ${message ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Message:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${message}</td>
        </tr>
        ` : ''}
      </table>

      <p>
        <a href="${adminUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Go to Admin Dashboard
        </a>
      </p>

      <p style="color: #666; font-size: 14px; margin-top: 30px;">
        You can grant or deny this request from the admin dashboard.
      </p>
    </div>
  `;

  const textContent = `
New Access Request

User Email: ${userEmail}
Article: ${postTitle}
Document ID: ${documentId}
${message ? `Message: ${message}` : ''}

Go to Admin Dashboard: ${adminUrl}
  `.trim();

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAILS,
        subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send email:', error);
      return false;
    }

    console.log('Access request email sent to admins');
    return true;

  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
