import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validation/contact';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '@/lib/supabase/isConfigured';
import { sendContactNotification } from '@/lib/email/sendContactNotification';

// Initialize the administrative backend database connection
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'The request could not be processed. Please try again.' },
      { status: 400 }
    );
  }

  // Validate the incoming form data fields safely
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check your information and try again.', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const values = parsed.data;

  // Anti-bot honeypot check
  if (values.companyWebsiteUrl && values.companyWebsiteUrl.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Baseline system database availability check
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Our message portal is down for scheduled maintenance. Please try again later.' },
      { status: 500 }
    );
  }

  // 1. ATTEMPT DATABASE INSERTION
  const { data: inserted, error: insertError } = await adminSupabase
    .from('contact_submissions')
    .insert({
      name: values.name,
      email: values.email,
      company: values.company || null,
      website: values.website || null,
      phone: values.phone || null,
      service: values.service,
      budget: values.budget || null,
      message: values.message,
      status: 'new',
      email_sent: false, 
    })
    .select('id')
    .single();

  // If the database fails, give a highly polite, non-technical error message
  if (insertError || !inserted) {
    console.error('DATABASE CRITICAL ERROR:', insertError?.message);
    return NextResponse.json(
      { error: 'Our systems are experiencing a brief hiccup. Your message could not be saved right now. Please try again in a few minutes.' },
      { status: 500 }
    );
  }

  // 2. ATTEMPT EMAIL DISPATCH (RESEND)
  // We wrap this inside an isolated block so if Resend fails, the user still sees success!
  let emailSentStatus = false;
  let emailErrorLog: string | null = null;

  try {
    const emailResult = await sendContactNotification(values);
    if (emailResult && emailResult.ok) {
      emailSentStatus = true;
    } else {
      emailErrorLog = emailResult?.error || 'Resend provider returned a delivery failure alert.';
    }
  } catch (emailException: any) {
    emailErrorLog = emailException?.message || 'Network exception occurred during Resend API call.';
  }

  // 3. LOG EMAIL RESULTS SECURELY BACK INTO SUPABASE
  try {
    const { error: updateError } = await adminSupabase
      .from('contact_submissions')
      .update({
        email_sent: emailSentStatus,
        email_error: emailErrorLog,
      })
      .eq('id', inserted.id);

    if (updateError) {
      console.error('Failed to log email telemetry to database:', updateError.message);
    }
  } catch (trackingException) {
    console.error('Unhandled database log operation failure:', trackingException);
  }

  // 4. ALWAYS RETURN SUCCESS IF WRITTEN TO DATABASE
  // This keeps the user happy even if your Gmail notification configuration fails.
  return NextResponse.json({ ok: true });
}
