/**
 * Goes at: src/app/loading.tsx
 *
 * Next.js App Router shows this automatically, for free, on every route
 * navigation anywhere in the app — public pages AND the admin dashboard —
 * while that route's server-side work (data fetch + render) is in
 * flight. No wiring, no per-page imports: it's a reserved filename Next
 * looks for next to layout.tsx, and because nothing more specific exists
 * deeper in the tree (e.g. no src/app/internal-admin/loading.tsx), THIS
 * file is the fallback used everywhere, admin included.
 *
 * Visually this is the exact same loader as the one in src/app/layout.tsx
 * (same logo pulse + sliding progress bar, same markup/keyframe names) so
 * the two feel like one continuous loading screen instead of two
 * different animations:
 *   - layout.tsx's version → first visit / hard refresh (removed by a
 *     plain inline <script>, since React/GSAP aren't loaded yet during
 *     that window)
 *   - this file             → every navigation after that, everywhere
 *     (removed automatically by Next.js itself once the next segment is
 *     ready — no script needed here, that's what loading.tsx is for)
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-[18px]"
      style={{ background: '#FAF9F6' }}
    >
      {/* Swap the src below for your real logo path in /public if it
          differs from the one used in src/app/layout.tsx. */}
      <img
        src="/logo.png"
        alt="Champion Nexus"
        width={72}
        height={72}
        style={{ width: 72, height: 72, objectFit: 'contain', animation: 'site-loader-pulse 1.1s ease-in-out infinite' }}
      />
      <div
        style={{
          width: 36,
          height: 3,
          borderRadius: 2,
          background: '#E5E7EB',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#E95516',
            animation: 'site-loader-bar 1.1s ease-in-out infinite',
          }}
        />
      </div>

      {/* Same keyframe names as layout.tsx's loader on purpose — both are
          plain global @keyframes, so defining them twice (once per file)
          is harmless; it just keeps this file self-contained. */}
      <style>{`
        @keyframes site-loader-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.94); } }
        @keyframes site-loader-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}