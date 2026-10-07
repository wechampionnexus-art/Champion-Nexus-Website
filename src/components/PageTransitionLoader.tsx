"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';

function LoadingUI() {
  return (
    <div
      className="fixed inset-0 z-[2147483647] flex flex-col items-center justify-center gap-[18px]"
      style={{ background: '#FAF9F6' }}
    >
      <Image
        src="/logo.png"
        alt="Champion Nexus"
        width={100}
        height={100}
        priority 
        style={{ 
          width: 100, 
          height: 100, 
          objectFit: 'contain', 
          animation: 'site-loader-pulse 1.1s ease-in-out infinite' 
        }}
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
    </div>
  );
}

function LoaderTrigger() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // 1. Instantly hide the raw server-rendered loader once React hydatrates
    const rawLoader = document.getElementById('global-initial-loader');
    if (rawLoader) {
      rawLoader.style.display = 'none';
    }
    
    // 2. Clear client-side loading on page change completion
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // 3. Catch hard-refreshes, login forms, or dashboard redirects
    const handleBeforeUnload = () => {
      setIsNavigating(true);
    };

    // 4. Catch normal internal links
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        const targetAttr = anchor.getAttribute('target');

        if (href && href.startsWith('/') && !href.startsWith('#') && targetAttr !== '_blank') {
          setIsNavigating(true);
        }
      }
    };

    // 5. Catch programatic button redirects (like form submissions to /dashboard)
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      setIsNavigating(true);
      return originalPushState.apply(this, args);
    };

    document.addEventListener('click', handleLinkClick);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleLinkClick);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState = originalPushState;
    };
  }, []);

  if (!isNavigating) return null;

  return <LoadingUI />;
}

export default function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderTrigger />
    </Suspense>
  );
}
