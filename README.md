# Champion Nexus — Website & Admin Dashboard

A Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase website for
Champion Nexus, a digital marketing / SEO agency, with a full content-managed
blog, team, testimonials, contact form, and a secret-route admin dashboard.

> **Status note:** this codebase was written in a sandboxed environment with
> no network access, so it has **not** been `npm install`-ed, built, run, or
> deployed from here. Every file has passed a TypeScript **syntax** check
> (no parse errors), but it has not been type-checked against the real
> `next`/`@supabase/*`/`gsap`/`@tiptap/*` type definitions, and has not been
> executed. Follow the steps below on your own machine to install, build,
> and verify it — see "Known gaps / things to verify" at the end for exactly
> what still needs real-world testing.

---

## 1. Stack

- **Next.js 14** (App Router), **React 18**, **TypeScript**
- **Tailwind CSS** for styling (light theme: white/cream/gray + orange accent)
- **Supabase** — Postgres database, Auth, Storage (all with Row Level Security)
- **GSAP + ScrollTrigger** — restrained animation, reduced-motion aware
- **Lucide React** — icons
- **Tiptap** — rich-text blog editor in the admin dashboard
- **Resend** — contact-form email notifications (swappable)
- **Zod** — form validation (client + server)

## 2. Required Node version

Node.js **18.18 or newer** (Next.js 14 requirement).

## 3. Install dependencies

```bash
npm install
```

This is the first thing to run and verify — it will surface any dependency
version mismatches. If a specific pinned version in `package.json` is no
longer available, bump it to the latest compatible minor/patch version.

## 4. Create the Supabase project

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine).
2. In **Project Settings → API**, copy the **Project URL**, **anon public
   key**, and **service_role key**.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```

## 5. Apply database migrations

Using the Supabase CLI (recommended):

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Or manually: open **SQL Editor** in the Supabase dashboard and run, in
order:

1. `supabase/migrations/0001_init.sql` — tables, indexes, RLS policies, storage buckets
2. `supabase/migrations/0002_seed_services.sql` — original Champion Nexus service content

Verify afterward: **Table Editor** should show `services`, `blog_posts`,
`team_members`, `testimonials`, `contact_submissions`, `admin_profiles`, and
**Storage** should show `blog-images` and `team-images` buckets.

## 6. Create the first administrator

There is **no public sign-up** — this is intentional. Create the first admin
manually:

1. In the Supabase dashboard: **Authentication → Users → Add user** (set an
   email and password, or send a magic link — your choice).
2. Copy the new user's UUID.
3. In **SQL Editor**, run:
   ```sql
   insert into public.admin_profiles (id, email, role)
   values ('PASTE-USER-UUID-HERE', 'the-same-email@example.com', 'admin');
   ```
4. That account can now sign in at your admin URL (see next section).

To add more admins later, repeat steps 1–3 (or build a small internal tool —
there is intentionally no self-service admin creation in the public app).

## 7. The secret admin route

Set in `.env.local`:

```
ADMIN_ROUTE_SLUG=choose-something-private-and-unguessable
```

The dashboard is then reachable at `https://your-domain.com/<that-slug>`.
It is:
- Never linked from any page, nav, or footer.
- Excluded from the sitemap.
- The literal implementation path (`/internal-admin`) always 404s if
  requested directly — only the configured slug works (see `middleware.ts`).
- Still protected by real server-side Supabase-Auth + role checks on every
  request regardless of the URL — **the slug is obscurity, not the actual
  security boundary.** See `src/lib/auth/getAdminSession.ts` and
  `src/app/internal-admin/(protected)/layout.tsx`.

Change `ADMIN_ROUTE_SLUG` any time; nothing else needs updating.

## 8. Configure contact-form email delivery

Default provider: [Resend](https://resend.com) (has a free tier).

```
RESEND_API_KEY=
CONTACT_TO_EMAIL=the-real-inbox-that-should-receive-leads@example.com
CONTACT_FROM_EMAIL=onboarding@resend.dev   # or a verified sending domain
```

If you'd rather use a different provider or raw SMTP, everything is
isolated in `src/lib/email/sendContactNotification.ts` — swap the
implementation, keep the same function signature.

**Important:** `CONTACT_TO_EMAIL` must be a real, client-confirmed inbox
before launch — it is a placeholder in `.env.example`.

## 9. Add the real logo and favicon

This project ships with a logo processed from the Champion Nexus logo
asset provided earlier in this project (background removed, white strokes
recolored to dark ink so it reads on the new light theme, orange accent
preserved):

- `public/logo.png` — used in the header/footer (square, transparent)
- `public/favicon.ico`, `public/favicon-16.png`, `public/favicon-32.png`,
  `public/apple-touch-icon.png`, `public/icon-512.png`
- `public/og-default.png` — default social-share image

If the client provides an updated or higher-resolution logo later, replace
these files directly (same filenames) — no code changes needed.

## 10. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`. Until Supabase has real published content,
public pages render clearly-labeled **demo content** automatically (see
`src/lib/data/*.ts`) rather than crashing — this is intentional so you can
preview the site before publishing anything.

## 11. Lint, type-check, build

```bash
npm run lint
npm run typecheck
npm run build
```

Run all three before deploying. `npm run build` is the real, authoritative
check that the project compiles — do not skip it.

## 12. Deploy to Vercel


1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel: **New Project → Import** the repository.
3. In **Project Settings → Environment Variables**, add every variable from
   `.env.example` with real production values (Production **and** Preview
   environments).
4. Deploy.

## 13. Connect the domain (championnexus.pro)

1. In Vercel: **Project Settings → Domains → Add** → `championnexus.pro`
   (and `www.championnexus.pro` if desired, redirecting to the apex or
   vice versa).
2. At your domain registrar / Hostinger DNS, add the records Vercel shows
   you (typically an `A` record to Vercel's IP and/or a `CNAME` for `www`).
3. Wait for DNS propagation and certificate issuance (Vercel handles HTTPS
   automatically).
4. Set `WEBSITE_URL=https://championnexus.pro` in production env
   vars — this feeds the sitemap, canonical URLs, and Open Graph metadata.

## 14. Project structure

```
src/
  app/                     Pages (App Router)
    page.tsx               Home
    about/ services/ team/ blog/ contact/ privacy-policy/
    api/contact/route.ts   Contact form endpoint
    internal-admin/        Admin dashboard implementation (see §7)
      login/
      (protected)/         Auth-gated: dashboard, posts, team, testimonials, contacts
  components/
    layout/ ui/ home/ team/ blog/ contact/ admin/
  lib/
    supabase/   client.ts (browser) · server.ts (SSR, user session) · admin.ts (service-role, narrow use)
    auth/       session + admin-base-path helpers
    data/       Supabase queries with graceful demo-content fallback
    email/      sendContactNotification.ts
    validation/ contact.ts (zod schema, shared client+server)
    seo/        metadata.ts helper
supabase/
  migrations/   0001_init.sql (schema+RLS+storage), 0002_seed_services.sql
middleware.ts   Secret admin route rewrite + direct-access block
```

## 15. Security notes (please read before launch)

- `SUPABASE_SERVICE_ROLE_KEY` is never imported into any Client Component —
  `src/lib/supabase/admin.ts` is marked `server-only` and is barely used;
  almost everything goes through the signed-in admin's own session + RLS.
- Every admin Server Action (`posts/actions.ts`, `team/actions.ts`,
  `testimonials/actions.ts`, `contacts/actions.ts`) independently calls
  `requireAdminSession()` — it does not rely solely on the layout guard,
  because Server Actions are independently callable.
- `contact_submissions` has no public SELECT policy — only INSERT (for the
  public form) and admin-only SELECT/UPDATE/DELETE. Verify this in the
  Supabase dashboard under **Authentication → Policies** after migrating.
- The admin route slug is **not** listed in `robots.txt` on purpose (a
  public robots.txt is a bad place to "hide" a secret path — see the
  comment in `src/app/robots.ts`).
- Rate limiting on `/api/contact` is a small in-memory limiter — fine as a
  baseline, but it resets on cold start and doesn't share state across
  serverless instances. For stronger protection, add a durable rate
  limiter (e.g. Upstash Redis, which has a free tier) before heavy traffic.

## 16. Known gaps / things to verify (please don't skip this)

Because this was built without the ability to `npm install` or run the
project, please specifically verify these before considering it launch-ready:

- [ ] `npm install` completes without version conflicts.
- [ ] `npm run build` completes with zero TypeScript errors (this is the
      first *real* type-check this project has had — the syntax check run
      during development does not catch type errors).
- [ ] `useFormState`/`useFormStatus` import correctly from `react-dom` with
      the exact Next/React versions installed (this is version-sensitive;
      if it errors, check whether your installed Next version expects
      `useActionState` from `react` instead).
- [ ] Tiptap's `generateHTML` + the sanitizer allow-list in
      `RichTextRenderer.tsx` render every formatting option in the toolbar
      correctly (headings, lists, links, images, blockquote).
- [ ] Image uploads: this project expects you to upload an image to the
      `blog-images`/`team-images` Supabase Storage buckets (e.g. via the
      Supabase dashboard for now) and paste the resulting public URL into
      the relevant form field. A direct in-dashboard upload *button* was
      not built — it's a reasonable fast-follow if wanted.
- [ ] GSAP animations (hero entrance, team marquee) — verify timing/easing
      feels right in a real browser; it was written carefully but never
      visually previewed.
- [ ] Full keyboard-navigation and screen-reader pass.
- [ ] Real Core Web Vitals / Lighthouse pass once deployed.
- [ ] Legal review of `privacy-policy/page.tsx` — it's accurate to what the
      code actually does, but is not a substitute for legal review, and the
      bracketed placeholders need the client's real answers.
