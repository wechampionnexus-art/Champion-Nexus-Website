-- ============================================================================
-- SEED: original Champion Nexus service content.
-- Written from scratch for Champion Nexus — not copied from any reference
-- site. Safe to re-run (upserts on slug). Admins can edit every field from
-- the dashboard afterward.
-- ============================================================================

insert into public.services (title, slug, short_description, description, icon, featured, published, display_order)
values
(
  'Search Engine Optimization',
  'search-engine-optimization',
  'Technical, on-page, and content SEO built to improve how your business shows up in search over time.',
  '<h2>What it is</h2><p>Search Engine Optimization is the ongoing work of making a website easier for search engines to crawl, understand, and rank — and easier for real visitors to find and act on.</p>
<h2>The problem it addresses</h2><p>Many businesses have a website that looks fine but is effectively invisible in search: slow pages, unclear structure, thin content, or no clear keyword strategy.</p>
<h2>What it may include</h2><ul><li>Technical SEO review (site speed, crawlability, indexing issues)</li><li>Keyword research and content mapping</li><li>On-page optimization (titles, headings, internal linking)</li><li>Ongoing content recommendations</li></ul>
<h2>How the process works</h2><ol><li>Audit your current site and search visibility</li><li>Agree on priority keywords and pages</li><li>Implement technical and on-page changes</li><li>Monitor and report on progress monthly</li></ol>
<h2>What we need from you</h2><p>Access to your website/CMS and analytics (or a willingness to grant access), and a short conversation about your business goals.</p>
<h2>FAQ</h2><p><strong>How long before I see results?</strong> SEO is a medium-to-long-term channel. Early technical fixes can help quickly; ranking and traffic improvements typically build over several months.</p><p><strong>Do you guarantee rankings?</strong> No. Any provider guaranteeing a specific ranking position is not being straightforward with you — we focus on sustainable improvement instead.</p>',
  'search',
  true, true, 1
),
(
  'Guest Posting',
  'guest-posting',
  'Earn visibility and relevant backlinks through placements on sites your audience already reads.',
  '<h2>What it is</h2><p>Guest posting means placing a well-written article on another, relevant website — introducing your brand to a new audience while contributing a natural, earned backlink.</p>
<h2>The problem it addresses</h2><p>Buying links or using low-quality directories can do more harm than good. Guest posting, done on genuinely relevant sites, is a more durable way to build visibility and authority.</p>
<h2>What it may include</h2><ul><li>Research into relevant, reasonably reputable publications</li><li>Topic pitching aligned with publisher guidelines</li><li>Article writing and submission</li><li>Placement tracking and reporting</li></ul>
<h2>How the process works</h2><ol><li>Identify publications relevant to your industry</li><li>Pitch topics that fit each publisher''s audience</li><li>Write and submit the content</li><li>Track and report on published placements</li></ol>
<h2>What we need from you</h2><p>An overview of your business, any topics/angles you''d like to avoid, and sign-off on draft pitches.</p>
<h2>FAQ</h2><p><strong>What kind of sites do you target?</strong> Sites that are topically relevant to your industry and maintain reasonable editorial standards — not link farms.</p>',
  'pen-line',
  true, true, 2
),
(
  'Link Building',
  'link-building',
  'Relevant, quality-focused backlink strategies that strengthen your site''s authority.',
  '<h2>What it is</h2><p>Link building is the practice of earning links from other websites back to yours — one of the signals search engines use to judge trust and relevance.</p>
<h2>The problem it addresses</h2><p>A site with little to no quality backlink profile often struggles to rank, even with strong content, because search engines have little external signal that the site is trustworthy.</p>
<h2>What it may include</h2><ul><li>Backlink profile analysis (yours and competitors'')</li><li>Outreach-based link acquisition</li><li>Resource/broken-link opportunities</li><li>Ongoing authority monitoring</li></ul>
<h2>How the process works</h2><ol><li>Audit your existing backlink profile</li><li>Identify realistic link opportunities</li><li>Run outreach campaigns</li><li>Monitor authority growth over time</li></ol>
<h2>What we need from you</h2><p>Access to analytics/Search Console (or willingness to grant it), and any existing partner or industry relationships worth leveraging.</p>
<h2>FAQ</h2><p><strong>Do you use paid or spam links?</strong> No — we focus on relevant, quality-focused link building rather than shortcuts that risk search penalties.</p>',
  'link',
  false, true, 3
),
(
  'SEO Audit',
  'seo-audit',
  'A full technical, on-page, and content review that shows exactly what is holding your site back.',
  '<h2>What it is</h2><p>A structured, prioritized review of your website''s technical health, on-page structure, and content — the diagnostic step before investing further in SEO.</p>
<h2>The problem it addresses</h2><p>Without a clear audit, it is easy to spend time and budget on the wrong priorities. An audit tells you what to fix first, and why it matters.</p>
<h2>What it may include</h2><ul><li>Technical crawl and error identification</li><li>On-page and content review</li><li>Site speed and mobile usability check</li><li>A prioritized action plan</li></ul>
<h2>How the process works</h2><ol><li>Full site crawl</li><li>Manual technical and content review</li><li>Compile prioritized findings</li><li>Walk through recommendations with you</li></ol>
<h2>What we need from you</h2><p>Your site URL and, where possible, analytics access for a more complete picture.</p>
<h2>FAQ</h2><p><strong>How long does an audit take?</strong> Typically one to two weeks, depending on site size and complexity.</p>',
  'clipboard-check',
  true, true, 4
),
(
  'Competitor Analysis',
  'competitor-analysis',
  'Understand how competitors are winning visibility — and where your real opportunities are.',
  '<h2>What it is</h2><p>A structured look at how your direct competitors are approaching search visibility, content, and backlinks — used to find realistic, specific opportunities for your business.</p>
<h2>The problem it addresses</h2><p>Strategy built in a vacuum often misses what is already working in your market. Competitor analysis shortcuts a lot of guesswork.</p>
<h2>What it may include</h2><ul><li>Competitor keyword analysis</li><li>Backlink gap analysis</li><li>Content and positioning review</li><li>A short list of specific opportunities</li></ul>
<h2>How the process works</h2><ol><li>Identify 3–5 direct competitors</li><li>Analyze their SEO and content approach</li><li>Map gaps and opportunities</li><li>Translate findings into next steps</li></ol>
<h2>What we need from you</h2><p>Who you consider your main competitors, and any markets/segments you want the analysis to focus on.</p>
<h2>FAQ</h2><p><strong>How many competitors do you analyze?</strong> Typically three to five, depending on your market.</p>',
  'radar',
  false, true, 5
),
(
  'Content Marketing',
  'content-marketing',
  'Strategic content that attracts the right audience and supports long-term search visibility.',
  '<h2>What it is</h2><p>Planned, intentional content — built around what your audience is actually searching for — rather than sporadic posts with no clear purpose.</p>
<h2>The problem it addresses</h2><p>Publishing content without a strategy rarely moves the needle. Content mapped to real search intent and business goals performs very differently.</p>
<h2>What it may include</h2><ul><li>Content strategy and planning</li><li>Topic and keyword research</li><li>Writing and on-page optimization</li><li>Performance tracking</li></ul>
<h2>How the process works</h2><ol><li>Define goals and audience</li><li>Build a content calendar</li><li>Produce and publish content</li><li>Review performance and iterate</li></ol>
<h2>What we need from you</h2><p>Brand voice guidance (if you have it), subject-matter input, and approval on drafts.</p>
<h2>FAQ</h2><p><strong>Do you write the content yourselves?</strong> Yes — content is planned and written in-house, aligned with your brand voice.</p>',
  'file-text',
  false, true, 6
),
(
  'Social Media Marketing',
  'social-media-marketing',
  'Consistent, engaging presence across the platforms that matter most to your audience.',
  '<h2>What it is</h2><p>Planned content and engagement across the social platforms where your audience actually spends time.</p>
<h2>The problem it addresses</h2><p>Inconsistent or purely promotional social presence tends to underperform. A clear platform strategy and content cadence perform better over time.</p>
<h2>What it may include</h2><ul><li>Platform strategy</li><li>Content planning and scheduling</li><li>Community engagement support</li><li>Performance reporting</li></ul>
<h2>How the process works</h2><ol><li>Define platform priorities</li><li>Build a content calendar</li><li>Publish and engage consistently</li><li>Review and refine the approach</li></ol>
<h2>What we need from you</h2><p>Access to your social accounts (or admin invites), brand assets, and any compliance/voice guidelines.</p>
<h2>FAQ</h2><p><strong>Which platforms do you recommend?</strong> It depends on your audience — we help identify where your strategy will have the most impact rather than defaulting to every platform.</p>',
  'share-2',
  false, true, 7
),
(
  'SEO Reporting & Analytics',
  'seo-reporting-analytics',
  'Clear, honest reporting so you always know what is working and why.',
  '<h2>What it is</h2><p>Regular, easy-to-understand reporting on the metrics that actually reflect progress — not a wall of numbers with no context.</p>
<h2>The problem it addresses</h2><p>Without clear reporting, it is hard to know whether an SEO or marketing investment is paying off, or where to adjust.</p>
<h2>What it may include</h2><ul><li>Custom reporting dashboards</li><li>Monthly performance summaries</li><li>Goal and KPI tracking</li><li>Strategy review calls</li></ul>
<h2>How the process works</h2><ol><li>Define the metrics that matter to your business</li><li>Set up tracking and dashboards</li><li>Deliver regular reports</li><li>Review and adjust strategy together</li></ol>
<h2>What we need from you</h2><p>Analytics access, and clarity on what "success" looks like for your business.</p>
<h2>FAQ</h2><p><strong>How often will I receive reports?</strong> Typically monthly, with more frequent updates available on request.</p>',
  'bar-chart-3',
  false, true, 8
)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  icon = excluded.icon,
  featured = excluded.featured,
  published = excluded.published,
  display_order = excluded.display_order;
