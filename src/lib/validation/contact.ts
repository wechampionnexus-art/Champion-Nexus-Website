import { z } from 'zod';

export const SERVICE_OPTIONS = [
  'Search Engine Optimization',
  'Guest Posting',
  'Link Building',
  'SEO Audit',
  'Competitor Analysis',
  'Content Marketing',
  'Social Media Marketing',
  'SEO Reporting & Analytics',
  'Not sure yet',
] as const;

export const BUDGET_OPTIONS = [
  'Under $500/mo',
  '$500–$1,500/mo',
  '$1,500–$5,000/mo',
  '$5,000+/mo',
  'Not sure yet',
] as const;

/**
 * Shared between the client form (for inline validation) and the
 * /api/contact Route Handler (the authoritative check — never trust the
 * client alone).
 */
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z.string().trim().email('Please enter a valid email address.').max(200),
  company: z.string().trim().max(160).optional().or(z.literal('')),
  website: z.string().trim().max(200).optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  service: z.enum(SERVICE_OPTIONS, { errorMap: () => ({ message: 'Please choose a service.' }) }),
  budget: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Please add a few details (10+ characters).').max(4000),
  // Honeypot field: real users never fill this in; bots that auto-fill every
  // field will, which lets us silently drop the submission as spam.
  companyWebsiteUrl: z.string().max(0).optional().or(z.literal('')),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
