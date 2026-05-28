# AgentOS Listing Copy

A mobile-first SaaS app for real estate agents that generates MLS-ready listing descriptions, social media captions, and video scripts from property details — powered by AI.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with:

```env
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_SINGLE=
NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Deploy Commands

### Web (Vercel)

```bash
npm run build          # Production build
npx vercel --prod      # Deploy to Vercel
```

### Mobile (Android & iOS via Capacitor)

This app is wrapped with [Capacitor](https://capacitorjs.com/) for native mobile deployment.

#### Initial Setup

```bash
npm run build                      # Build the Next.js static export
npx cap sync                       # Sync web assets to native projects
```

#### Android

```bash
npx cap open android               # Open in Android Studio
npx cap run android                # Run on connected device/emulator
npx cap sync android               # Sync latest web build to Android
```

Build a release APK/AAB from Android Studio:
- **Build → Generate Signed Bundle / APK**
- Upload to Google Play Console

#### iOS

```bash
npx cap open ios                   # Open in Xcode
npx cap run ios                    # Run on connected device/simulator
npx cap sync ios                   # Sync latest web build to iOS
```

Build for App Store from Xcode:
- **Product → Archive**
- Upload via App Store Connect

### Ship Today Workflow

```bash
# Full mobile deploy pipeline:
npm run build:mobile               # Build + sync to native projects
npm run deploy:android             # Open Android Studio ready to ship
npm run deploy:ios                 # Open Xcode ready to ship
```

## Project Structure

```
/pages          - Next.js pages (landing, wizard, API routes)
/components     - React UI components (wizard steps, pricing, results)
/lib            - Server helpers (OpenAI, Stripe, Supabase, credits)
/styles         - Global CSS (Tailwind)
/android        - Native Android project (Capacitor)
/ios            - Native iOS project (Capacitor)
```

## Features

- 3-step wizard: Address → Details → AI-generated listing content
- MLS descriptions, social captions, and video scripts
- Guest mode (2 free generations) or paid plans ($9 single / $19/mo)
- Stripe payments, Supabase auth & database
- Native mobile apps via Capacitor (Android + iOS)

## Tech Stack

- Next.js (Pages Router, TypeScript)
- React + Tailwind CSS
- Capacitor (Android & iOS native wrappers)
- OpenAI API (gpt-4o-mini)
- Stripe (payments)
- Supabase (auth + Postgres)

