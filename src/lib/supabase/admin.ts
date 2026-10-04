import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Service-role Supabase client. This BYPASSES Row Level Security entirely.
 *
 * The `server-only` import above makes it a build error to ever import this
 * file from a Client Component.
 *
 * Use this ONLY for operations that genuinely cannot go through a user's own
 * RLS-governed session — for example, verifying an admin_profiles row during
 * first-admin setup, or a server-side storage cleanup job. Every normal
 * admin CRUD action in this project uses the authenticated admin's own
 * session (src/lib/supabase/server.ts) + the RLS policies in
 * supabase/migrations/0001_init.sql instead, which is the safer default.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. This key is required only for ' +
        'narrow server-only operations and must never be exposed to the client.'
    );
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
