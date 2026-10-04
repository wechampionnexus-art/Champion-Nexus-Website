/**
 * True once real Supabase credentials are present. Data-access modules in
 * src/lib/data/* use this to fall back to clearly labeled demo content
 * during local development before a Supabase project is connected, rather
 * than crashing the page. Once env vars are set, this returns true and the
 * demo-content branches are never used.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
