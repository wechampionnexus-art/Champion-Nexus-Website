import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="pt-40 pb-24 text-center">
      <div className="max-w-md mx-auto px-5">
        <span className="font-display font-extrabold text-brand-orange text-6xl">404</span>
        <h1 className="font-display font-bold text-2xl text-ink mt-4 mb-3">Page not found</h1>
        <p className="text-ink-muted text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <ButtonLink href="/">Back to homepage</ButtonLink>
      </div>
    </section>
  );
}
