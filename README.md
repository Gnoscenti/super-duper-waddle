# super-duper-waddle
You are my senior full-stack engineer.

First: read this entire prompt completely.  
Do NOT start coding until you’ve read everything.  
When you’re done reading, reply with: “ACK: READY TO BUILD AGENTOS-LISTING-COPY”.

Then begin implementing.

====================================================
PROJECT OVERVIEW
====================================================

We’re building a tiny SaaS for real estate agents:

Given:
- Property address
- Basic property facts (beds, baths, sq ft, lot, type, view, upgrades, schools)
- Up to 6 photos (for context, but V1 can ignore actual image content if needed)

Return:
1) MLS-ready listing description  
2) 3 social media captions (IG/FB/Reels)  
3) A tight 30-second vertical video script (VO + shot beats)

MVP PRIORITIES:
- Fast to use: 3-step wizard (Address → Details → Output)
- Simple auth: email+password (Supabase) OR optional “Continue as guest”
- Stripe Checkout:
  - $9 one-off “Single Listing”
  - $19/mo “Agent Pro” subscription with monthly quota (e.g. 8 generations)
- OpenAI text model (e.g. gpt-4o-mini or equivalent) for copy generation
- Deployable to Vercel with minimal config

Tech stack (use this unless impossible for you):
- Next.js (Pages Router, TypeScript)
- React + Tailwind CSS
- API routes under /pages/api
- Stripe for payments
- Supabase for:
  - Auth
  - Postgres DB (jobs, users, plans)
- OpenAI API for text

App name: AgentOS Listing Copy (MVP)

====================================================
FEATURE SPEC
====================================================

MAIN FLOW:
1) Landing page (`/`)
   - Hero: “Turn any address into a full listing package in seconds”
   - CTA: “Try it now” → wizard
   - Simple explanation (3 steps)
   - Pricing cards: $9 single / $19 per month

2) Wizard page (`/app`)
   STEP 1: Address & Plan
   - Fields:
     - Address (single line)
     - Dropdown: Property type [Detached, Condo, Townhome, Multi-Unit, Land]
     - Toggle: “Luxury / High-End Listing” (yes/no)
   - If user is not logged in and chooses a paid plan → redirect to `/pricing` or open Stripe Checkout

   STEP 2: Property Details
   - Beds (number)
   - Baths (number)
   - Living area sq ft (number)
   - Lot size (number, optional)
   - Year built (optional)
   - View type (select: None / City / Ocean / Mountain / Canyon / Golf / Other)
   - Neighborhood vibe (select: Family, Luxury, Coastal, Equestrian, Urban, Rural, Investment)
   - School notes (optional short text, factual only)
   - Upgrades (textarea: comma-separated list)
   - Photos: allow upload of up to 6 images (for now just store URLs or ignore content)

   STEP 3: Results
   - Show spinner while waiting
   - Display:
     - MLS description (copy button)
     - 3 caption cards (copy buttons)
     - Video script as a list of beats: each line with “VO:” or “SHOT:”
   - “Save this listing” button saves to DB (if logged in)
   - “Start another” resets wizard

BACKEND / LIMITS:
- Basic rate limiting:
  - If “guest” mode: max 2 generations per 24 hours per IP
  - If $9 single: 1 generation credit
  - If $19/mo: 8 generations per month, then $2 per extra (can just block with “no credits left” message in MVP)
- Keep all keys in environment variables.
- Do not hardcode any secrets.

====================================================
DATA MODEL (SUPABASE)
====================================================

Use Supabase SQL-ish schema (actual migrations not strictly required, but design code with this in mind):

Table: users
- id: uuid (Supabase auth id, PK)
- email: text, unique
- created_at: timestamptz, default now()

Table: plans
- id: uuid, PK
- user_id: uuid (FK -> users.id)
- plan_type: text (‘SINGLE’, ‘SUBSCRIPTION’)
- stripe_customer_id: text
- stripe_price_id: text
- stripe_subscription_id: text (nullable for SINGLE)
- credits_total: int (monthly allowance or 1 for SINGLE)
- credits_used: int
- renews_at: timestamptz (null for SINGLE)
- created_at: timestamptz

Table: jobs
- id: uuid, PK
- user_id: uuid nullable (guest = null)
- address: text
- property_type: text
- beds: int
- baths: numeric(3,1)
- living_sqft: int
- lot_sqft: int nullable
- year_built: int nullable
- view_type: text
- neighborhood_vibe: text
- school_notes: text nullable
- upgrades: text nullable
- is_luxury: boolean
- model_used: text
- description: text
- captions_json: jsonb (array of strings)
- video_script_json: jsonb (array of lines)
- created_at: timestamptz

====================================================
PROMPT DESIGN (OPENAI)
====================================================

Use a single chat completion call with a structured response.

System prompt (example – you can embed this in code):

“You are a professional listing copywriter in San Diego specializing in MLS descriptions, social captions, and short video scripts. 
You must:
- Be factually accurate and avoid unverifiable claims.
- Avoid any discriminatory or fair-housing violations.
- Avoid absolute language like ‘best’, ‘perfect for families’, or ‘safe neighborhood’.
- Describe features, not people.”

User content should include a JSON blob like:

{
  "address": "...",
  "propertyType": "...",
  "beds": 4,
  "baths": 3,
  "livingSqft": 2450,
  "lotSqft": 10000,
  "yearBuilt": 1998,
  "viewType": "Canyon",
  "neighborhoodVibe": "Luxury",
  "schoolNotes": "Within 1 mile of highly rated XYZ Elementary (check district info)",
  "upgrades": ["Remodeled kitchen 2022", "New roof 2020"],
  "isLuxury": true
}

Tell the model to respond in strict JSON:

{
  "description": "... MLS-safe description ...",
  "captions": ["...", "...", "..."],
  "videoScript": [
    "VO: ...",
    "SHOT: ...",
    "VO: ...",
    "SHOT: ..."
  ]
}

Parse this JSON on the server and return to the frontend.

====================================================
PROJECT STRUCTURE
====================================================

Create a Next.js + TypeScript app with this minimal structure:

- package.json
- next.config.js
- tsconfig.json
- postcss.config.cjs
- tailwind.config.cjs
- /pages
  - index.tsx            // landing page + pricing section + entry CTA
  - app.tsx (optional)   // or use /app route if you prefer, but pages is fine
  - /app
    - index.tsx          // wizard UI (3 steps with React state)
  - /api/generate.ts     // POST, calls OpenAI and enforces credits
  - /api/credits.ts      // GET, returns remaining credits
  - /api/stripe/checkout-session.ts // creates Stripe Checkout session web URL
  - /api/stripe/webhook.ts          // handles Stripe webhooks (subscription + single purchase)

- /components
  - Layout.tsx
  - Stepper.tsx
  - PropertyFormStep1.tsx
  - PropertyFormStep2.tsx
  - ResultsPanel.tsx
  - PricingCards.tsx

- /lib
  - openai.ts      // OpenAI client helper
  - stripe.ts      // Stripe client helper
  - supabase.ts    // Supabase server client helper
  - credits.ts     // logic for consuming/checking credits

- /styles
  - globals.css

====================================================
.ENV EXPECTATIONS
====================================================

Design the app to rely on these environment variables:

- OPENAI_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY  // server only
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PRICE_SINGLE
- NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION
- NEXT_PUBLIC_BASE_URL   // for redirects

Ensure server-side only env vars are not exposed to client bundles.

====================================================
MINIMUM IMPLEMENTATION REQUIREMENTS
====================================================

1) /pages/index.tsx
   - Hero section: headline, subheading, CTA button.
   - “How it works” 3-step explanation.
   - Embedded `<PricingCards />`.
   - CTA button navigates to `/app`.

2) /pages/app/index.tsx
   - Simple 3-step wizard implemented with React state:
     - step = 1,2,3
     - Step 1: address + propertyType + isLuxury
     - Step 2: details (beds, baths, sqft, etc.), upgrades, schoolNotes, photo upload input
     - Step 3: call `/api/generate` on submit, show loading state and then the JSON outputs.
   - “Copy” buttons using `navigator.clipboard.writeText`.

3) /pages/api/generate.ts
   - Accepts POST JSON: { address, propertyType, beds, baths, ... }
   - Validate required fields.
   - Enforce very basic IP/guest throttling in memory OR accept a `userId` and stub a DB-based check.
   - Call OpenAI’s chat completion endpoint with the system + user prompts described above.
   - Parse JSON safely; return { description, captions, videoScript } or 500 on error.

4) /components/PricingCards.tsx
   - Two cards: $9 Single, $19/mo Pro
   - Buttons that call a handler which hits `/api/stripe/checkout-session` with { planType: 'SINGLE' | 'SUBSCRIPTION' }.

5) Basic Tailwind styling:
   - Responsive layout, minimal but modern.
   - Don’t overcomplicate: just a clean SaaS landing + simple wizard.

====================================================
NON-GOALS FOR V1
====================================================

- No need for full multi-tenant orgs.
- No need for complex image analysis.
- No need for deep MLS integrations.
- Basic error messages are fine.

====================================================
DELIVERABLE
====================================================

Produce:
- All code files as described.
- A short README.md with:
  - How to install (npm install)
  - How to run dev (npm run dev)
  - Required env vars
  - Basic deployment notes for Vercel + Supabase + Stripe

When you finish scaffolding, summarize:
- What you implemented
- What is left as TODO
- Any assumptions made

End summary with: “BUILD COMPLETE: AGENTOS-LISTING-COPY MVP READY”.
