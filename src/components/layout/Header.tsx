'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu } from 'lucide-react';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          scrolled ? 'bg-white/90 backdrop-blur-md border-line shadow-sm' : 'bg-transparent border-transparent'
        )}
      >
        <div className="max-w-container mx-auto px-5 md:px-8 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo.png" alt="Champion Nexus" width={135} height={60} className="rounded" priority />
            
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-display text-sm font-semibold">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-ink-muted hover:text-ink transition-colors',
                  pathname === link.href && 'text-ink'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
            >
              Get a Consultation <ArrowUpRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            className="lg:hidden p-2 text-ink"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
    </>
  );
}
