import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import dbConnect from '../../lib/db';
import User from '../../lib/models/User';
import Link from '../../lib/models/Link';

export const ALL: APIRoute = async ({ request }) => {
  try {
    // 1. Verify CRON Security Token
    const url = new URL(request.url);
    const querySecret = url.searchParams.get('secret');
    
    const authHeader = request.headers.get('Authorization');
    const headerSecret = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;
      
    const cronSecret = import.meta.env.CRON_SECRET || 'local_cron_secret';
    
    if (querySecret !== cronSecret && headerSecret !== cronSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Initialize DB & Resend client
    await dbConnect();
    
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not defined in environment variables.');
    }
    const resend = new Resend(resendApiKey);
    const senderEmail = import.meta.env.SENDER_EMAIL || 'The Weekend Read <onboarding@resend.dev>';

    // 3. Retrieve all users
    const users = await User.find({});
    const report: Array<{ email: string; linksCount: number; status: string; error?: string }> = [];

    for (const user of users) {
      // Find pending links for this user
      const pendingLinks = await Link.find({ clerkId: user.clerkId, status: 'pending' });
      
      if (pendingLinks.length === 0) {
        report.push({ email: user.email, linksCount: 0, status: 'skipped (no pending links)' });
        continue;
      }

      // Randomly select exactly 3 (or fewer if that's all they have)
      const selectedLinks = pendingLinks
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // Generate HTML newsletter layout
      const currentDateString = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const linksHtml = selectedLinks
        .map((link) => {
          const displayTitle = link.title || link.url;
          const descriptionHtml = link.description
            ? `<p style="margin: 6px 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #4d4d4d;">${link.description}</p>`
            : '';
          return `
            <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #ebebeb;">
              <h3 style="margin: 0 0 6px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #171717;">
                ${displayTitle}
              </h3>
              ${descriptionHtml}
              <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #0070f3; text-decoration: none; word-break: break-all;">
                Read Link &rarr;
              </a>
            </div>
          `;
        })
        .join('');

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Weekend Read</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fafafa; padding: 48px 24px;">
            <tr>
              <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border: 1px solid #ebebeb; border-radius: 8px; padding: 32px; box-shadow: 0px 1px 2px rgba(0,0,0,0.02), 0px 4px 12px rgba(0,0,0,0.03);">
                  <!-- Header -->
                  <tr>
                    <td style="padding-bottom: 24px; border-bottom: 1px solid #ebebeb;">
                      <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888888;">
                        Weekly Digest &middot; ${currentDateString}
                      </span>
                      <h1 style="margin: 6px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 600; color: #171717; letter-spacing: -0.02em;">
                        The Weekend Read.
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body Greeting -->
                  <tr>
                    <td style="padding: 24px 0 16px 0;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #4d4d4d;">
                        Hello! Here is your curated weekend digest of exactly ${selectedLinks.length} save${selectedLinks.length > 1 ? 's' : ''}. The rest of your queue remains locked until next week to enforce focus. Happy reading.
                      </p>
                    </td>
                  </tr>

                  <!-- Curated Links -->
                  <tr>
                    <td style="padding-top: 8px;">
                      ${linksHtml}
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 16px; text-align: center;">
                      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #888888; line-height: 1.5;">
                        You received this because you signed up at <a href="https://readinglistapp.com" style="color: #888888; text-decoration: underline;">readinglistapp.com</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      try {
        // Send email with Resend
        const { data, error } = await resend.emails.send({
          from: senderEmail,
          to: user.email,
          subject: `Your Weekend Read — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          html: emailHtml
        });

        if (error) {
          throw new Error(error.message || JSON.stringify(error));
        }

        // Mark sent links as 'sent' in MongoDB
        const sentIds = selectedLinks.map(link => link._id);
        await Link.updateMany(
          { _id: { $in: sentIds } },
          { $set: { status: 'sent', sentAt: new Date() } }
        );

        // Update user digest sending timestamp
        user.lastDigestSentAt = new Date();
        await user.save();

        report.push({ email: user.email, linksCount: selectedLinks.length, status: 'success' });
      } catch (err: any) {
        report.push({ email: user.email, linksCount: selectedLinks.length, status: 'error', error: err.message || err });
      }
    }

    return new Response(JSON.stringify({ success: true, processedUsersCount: users.length, report }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
