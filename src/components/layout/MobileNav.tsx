'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

type NavLink = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
};

export function MobileNav({ open, onClose, links }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = 'hidden';
      closeBtnRef.current?.focus();
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`absolute top-0 right-0 bottom-0 w-[84%] max-w-sm bg-white border-l border-line flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-line">
          <span className="font-display font-bold text-ink">Menu</span>
          <button ref={closeBtnRef} type="button" aria-label="Close menu" className="p-2 text-ink" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-6 font-display text-xl font-semibold">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink" onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-6">
          <Link
            href="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-display font-semibold text-sm px-5 py-3 rounded-full transition-colors"
          >
            Get a Consultation <ArrowUpRight size={16} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
