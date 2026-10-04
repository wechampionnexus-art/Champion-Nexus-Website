import 'server-only';
import { Resend } from 'resend';
import type { ContactFormValues } from '@/lib/validation/contact';

type SendResult = { ok: true } | { ok: false; error: string };

/**
 * Sends an internal notification email when a contact form is submitted.
 * The submission is ALREADY saved to Supabase before this runs (see
 * src/app/api/contact/route.ts) — if email delivery fails, the lead is not
 * lost, and the caller records the failure on the saved row for admin
 * follow-up instead of silently dropping it.
 *
 * Swap this file for a different provider/SMTP service if preferred; the
 * function signature is what the Route Handler depends on.
 */
export async function sendContactNotification(values: ContactFormValues): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return {
      ok: false,
      error:
        'Email is not configured (missing RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL).',
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Champion Nexus Website <${fromEmail}>`,
      to: [toEmail],
      replyTo: values.email,
      subject: `New inquiry: ${values.service} — ${values.name}`,
      text: [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        values.company ? `Company: ${values.company}` : null,
        values.website ? `Website: ${values.website}` : null,
        values.phone ? `Phone: ${values.phone}` : null,
        `Service: ${values.service}`,
        values.budget ? `Budget: ${values.budget}` : null,
        '',
        'Message:',
        values.message,
      ]
        .filter(Boolean)
        .join('\n'),
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown email error.' };
  }
}
