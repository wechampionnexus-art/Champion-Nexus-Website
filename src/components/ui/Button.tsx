import Link from 'next/link';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'outline' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold text-sm px-6 py-3 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-orange text-white hover:bg-brand-orange-hover',
  outline: 'border border-line text-ink bg-white hover:border-brand-orange hover:text-brand-orange',
  ghost: 'text-ink hover:text-brand-orange',
};

type LinkProps = { href: string; variant?: Variant; className?: string; children: ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'className'
>;

export function ButtonLink({ href, variant = 'primary', className, children, ...rest }: LinkProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

type BtnProps = { variant?: Variant; className?: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = 'primary', className, children, ...rest }: BtnProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
