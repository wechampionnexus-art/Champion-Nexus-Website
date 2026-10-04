import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  path: '/privacy-policy',
  noIndex: false,
});

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-36 pb-24 md:pt-44">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <span className="font-display text-xs font-semibold tracking-[0.14em] text-brand-orange uppercase">
          Legal
        </span>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink mt-4 mb-4">
          Privacy Policy
        </h1>
        <p className="text-ink-soft text-sm mb-12">
          This policy describes, accurately, what this website actually collects based on how it
          is built. It is not legal advice — have it reviewed by counsel before launch, and update
          the bracketed placeholders with confirmed details.
        </p>

        <div className="space-y-8 text-ink-muted text-sm leading-relaxed">
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Information we collect</h2>
            <p>
              When you submit the contact form, we collect the information you provide: name,
              email address, and optionally company, website, phone, service of interest, budget
              range, and your message. We do not collect this information through any other means
              on this site.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">How it is stored</h2>
            <p>
              Contact form submissions are stored in our Supabase database, protected by
              row-level security so that only authorized Champion Nexus administrators can read
              them. They are never publicly accessible.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Email notifications</h2>
            <p>
              When you submit the contact form, a notification email is sent to our team via
              [confirm email provider — Resend is configured by default] so we can respond to
              your inquiry.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Cookies and analytics</h2>
            <p>
              [To be confirmed: this template does not include any analytics or tracking
              cookies by default. If analytics are added later (e.g. a privacy-friendly
              analytics tool), this section must be updated to describe what is collected and
              why, and a cookie-consent mechanism should be added if required by applicable law.]
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Data retention</h2>
            <p>
              We retain contact submissions only as long as necessary to respond to your
              inquiry, or as required by law. [Exact retention period to be confirmed by the
              business owner.]
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Your rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal information
              by contacting us using the details on our{' '}
              <a href="/contact" className="text-brand-orange underline">Contact page</a>.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Security</h2>
            <p>
              We take reasonable technical measures to protect the information we hold,
              including database access controls (Row Level Security) and encrypted connections.
              No method of transmission over the internet is 100% secure.
            </p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Changes to this policy</h2>
            <p>This policy may be updated from time to time. Changes will be posted on this page.</p>
          </section>
          <section>
            <h2 className="font-display font-bold text-ink text-lg mb-2">Contact</h2>
            <p>
              Questions about this policy can be sent via our{' '}
              <a href="/contact" className="text-brand-orange underline">Contact page</a>{' '}
              [replace with a confirmed company email once available].
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
