'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, Users, Quote, Mail, LogOut, Menu, X } from 'lucide-react';
import { logoutAction } from '@/lib/auth/logoutAction';
import { cn } from '@/lib/utils/cn';

type Props = { adminBase: string; adminEmail: string };

export function AdminSidebar({ adminBase, adminEmail }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const links = [
    { href: adminBase, label: 'Overview', icon: LayoutDashboard, exact: true },
    { href: `${adminBase}/posts`, label: 'Blog Posts', icon: FileText },
    { href: `${adminBase}/team`, label: 'Team Members', icon: Users },
    { href: `${adminBase}/testimonials`, label: 'Testimonials', icon: Quote },
    { href: `${adminBase}/contacts`, label: 'Contact Submissions', icon: Mail },
  ];

  const navContent = (
    <>
      <nav className="p-4 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium transition-colors',
                active ? 'bg-brand-orange-light text-brand-orange' : 'text-ink-muted hover:bg-surface-gray'
              )}
            >
              <Icon size={17} /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 mt-auto border-t border-line">
        <p className="text-xs text-ink-soft px-3 mb-2 truncate">{adminEmail}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-medium text-ink-muted hover:bg-surface-gray transition-colors w-full"
          >
            <LogOut size={17} /> Log out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar — visible below md, hidden on desktop */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b border-line">
        <div>
          <p className="font-display font-bold text-ink text-sm">Champion Nexus</p>
          <p className="text-[11px] text-ink-soft -mt-0.5">Admin dashboard</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard menu"
          aria-expanded={open}
          className="p-2 text-ink"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile off-canvas drawer */}
      <div className={cn('fixed inset-0 z-50 md:hidden', open ? '' : 'pointer-events-none')} aria-hidden={!open}>
        <div
          className={cn(
            'absolute inset-0 bg-ink/40 transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard menu"
          className={cn(
            'absolute top-0 left-0 bottom-0 w-72 bg-white border-r border-line flex flex-col transition-transform duration-300',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-line">
            <p className="font-display font-bold text-ink text-sm">Menu</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 text-ink">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col flex-1">{navContent}</div>
        </aside>
      </div>

      {/* Desktop sidebar — hidden below md, static column on desktop */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-line min-h-screen">
        <div className="p-6 border-b border-line">
          <Image src="/logo.png" alt="Champion Nexus" width={120} height={120} className="mb-2" />
          <p className="text-xs text-ink-soft mt-0.5">Admin dashboard</p>
        </div>
        <div className="flex flex-col flex-1">{navContent}</div>
      </aside>
    </>
  );
}