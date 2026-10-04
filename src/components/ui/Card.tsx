import type { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Props = { children: ReactNode; className?: string; hover?: boolean } & HTMLAttributes<HTMLDivElement>;

export function Card({ children, className, hover = true, ...rest }: Props) {
  return (
    <div
      className={cn(
        'bg-white border border-line rounded-xl2 p-7 shadow-card transition-all duration-300',
        hover && 'hover:border-brand-orange/50 hover:shadow-cardHover hover:-translate-y-1',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
