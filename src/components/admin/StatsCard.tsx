import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Props = { icon: LucideIcon; label: string; value: string | number; accent?: boolean };

export function StatsCard({ icon: Icon, label, value, accent }: Props) {
  return (
    <div className="bg-white border border-line rounded-xl2 p-5">
      <div
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center mb-4',
          accent ? 'bg-brand-orange-light text-brand-orange' : 'bg-surface-gray text-ink-muted'
        )}
      >
        <Icon size={17} />
      </div>
      <p className="font-display font-extrabold text-2xl text-ink">{value}</p>
      <p className="text-xs text-ink-soft mt-1">{label}</p>
    </div>
  );
}
