'use client';

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Send } from 'lucide-react';
import { contactFormSchema, SERVICE_OPTIONS, BUDGET_OPTIONS } from '@/lib/validation/contact';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Clear a field's validation error automatically when the user types
  function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name } = e.target;
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const formElement = e.currentTarget;

    const formData = new FormData(formElement);
    const values = Object.fromEntries(formData.entries());

    const parsed = contactFormSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      // Check both the HTTP status and our explicit backend status token
      if (!res.ok || !json.ok) {
        setServerError(json.error || 'Our message portal is experiencing a brief connection hiccup. Please try again.');
        setStatus('error');
        return;
      }

      // FIXED: Form clears out and resets instantly now!
      setStatus('success');
      formElement.reset();
    } catch {
      setServerError('A network connection issue occurred. Please check your internet and try again.');
      setStatus('error');
    }
  }

  const inputClass =
    'w-full border border-line rounded-lg px-4 py-3 text-sm text-ink focus:border-brand-orange focus:outline-none transition-colors';
  const labelClass = 'block text-xs font-display font-semibold text-ink-muted mb-2';

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white border border-line rounded-xl2 shadow-card p-7 md:p-9 space-y-5">
      {/* Honeypot field — hidden from real users via CSS, bots that fill every field get silently rejected server-side. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="companyWebsiteUrl">Leave blank</label>
        <input id="companyWebsiteUrl" name="companyWebsiteUrl" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="name">Name *</label>
          <input id="name" name="name" type="text" className={inputClass} placeholder="Your full name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} onChange={handleInputChange} />
          {errors.name && <p id="name-error" className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" className={inputClass} placeholder="you@company.com" required aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} onChange={handleInputChange} />
          {errors.email && <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="company">Company</label>
          <input id="company" name="company" type="text" className={inputClass} placeholder="Company name" />
        </div>
        <div>
          <label className={labelClass} htmlFor="website">Website</label>
          <input id="website" name="website" type="text" className={inputClass} placeholder="yourcompany.com" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="text" className={inputClass} placeholder="Optional" />
        </div>
        <div>
          <label className={labelClass} htmlFor="service">Service of interest *</label>
          <select id="service" name="service" className={inputClass} required defaultValue="" aria-invalid={!!errors.service} onChange={handleInputChange}>
            <option value="" disabled>Select a service</option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.service && <p className="text-red-600 text-xs mt-1">{errors.service}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="budget">Budget range</label>
        <select id="budget" name="budget" className={inputClass} defaultValue="">
          <option value="">Select a range (optional)</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="message">Message *</label>
        <textarea id="message" name="message" rows={4} className={inputClass} placeholder="Tell us about your goals" required aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} onChange={handleInputChange} />
        {errors.message && <p id="message-error" className="text-red-600 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
      >
        {status === 'submitting' ? 'Sending…' : 'Send Inquiry'} <Send size={16} />
      </button>

      {status === 'success' && (
        <p role="status" className="text-sm text-green-700 font-medium mt-3">
          Thank you! Your message has been safely received. We&apos;ll get back to you shortly.
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600 font-medium mt-3">
          {serverError}
        </p>
      )}
    </form>
  );
}
