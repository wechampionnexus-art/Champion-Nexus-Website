/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseHost = '';
try {
  supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : '';
} catch {
  supabaseHost = '';
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
  // The secret admin route itself is handled in middleware.ts, which rewrites
  // the env-configured public slug to the internal /internal-admin
  // implementation and blocks direct access to /internal-admin. Keeping that
  // logic in middleware (rather than here) lets it read the env var at
  // request time and return a 404 for the literal internal path.
};

export default nextConfig;
