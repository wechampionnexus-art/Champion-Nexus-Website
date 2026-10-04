import { cn } from '@/lib/utils/cn';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = 'left', className }: Props) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-3 leading-tight">
        {title}
      </h2>
      {description ? <p className="text-ink-muted text-base md:text-lg mt-4 leading-relaxed">{description}</p> : null}
    </div>
  );
}
