/**
 * Goes at: src/app/api/cron/keep-alive/route.ts
 *
 * Supabase's free tier pauses a project after 7 days with no API
 * activity — this has nothing to do with whether people visit your
 * site; it specifically needs a request to hit Supabase's own API. This
 * route does one trivial Supabase read, and is meant to be triggered on
 * a schedule by Vercel Cron (see vercel.json, delivered alongside this
 * file) rather than by site visitors — if nobody visits for a week, a
 * visitor-triggered ping wouldn't fire either, which defeats the point.
 *
 * SECURITY: this endpoint does nothing destructive (read-only), but it's
 * still protected so random internet traffic can't repeatedly hit it.
 * Vercel Cron automatically sends `Authorization: Bearer <CRON_SECRET>`
 * on every scheduled invocation when a CRON_SECRET env var is set on the
 * project — this checks that header matches. Set CRON_SECRET in your
 * Vercel project's environment variables (any long random string) for
 * this to work; without it, every request (including Vercel's own cron
 * trigger) will be rejected with 401.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Prevents this route from being statically optimized/cached — it needs
// to actually run and hit Supabase on every invocation, not serve a
// cached response.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = createAdminClient();
    // Cheapest possible real read against your own project — counts as
    // API activity for Supabase's pause timer without pulling any real
    // data. admin_profiles always exists (it's part of your core
    // schema), so this doesn't depend on any particular content table
    // having rows.
    const { error } = await supabaseAdmin.from('admin_profiles').select('id').limit(1);

    if (error) {
      console.error('[keep-alive] Supabase ping failed:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
  } catch (err) {
    console.error('[keep-alive] unexpected error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}