# InstaTrack — Instagram Competitor Intelligence

A Micro SaaS application for tracking Instagram competitor profiles, analyzing posts & reels, and identifying content strategies through engagement metrics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Supabase |
| Auth | Supabase Auth (Google OAuth + Email/Password) |
| Database | PostgreSQL via Supabase with Row Level Security |
| Charts | Recharts |
| Icons | Lucide React |

## Features

- **Supabase Authentication** — Google OAuth + email/password, JWT sessions
- **Competitor Tracking** — Add and monitor Instagram accounts
- **Content Explorer** — Visual grid with filters (type, date, engagement)
- **Analytics** — Engagement trends, posting heatmap, content breakdowns
- **Reports** — Export PDF/CSV (Pro plan)
- **My Profile** — Connect your own Instagram account
- **Plan limits** — Free (3), Pro (20), Agency (100) competitors

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── auth/
│   │   ├── login/page.tsx          # Login (Google + email)
│   │   ├── signup/page.tsx         # Signup
│   │   ├── callback/route.ts       # Supabase OAuth callback
│   │   └── instagram/callback/     # Instagram OAuth callback
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar layout
│   │   ├── page.tsx                # Main dashboard
│   │   ├── competitors/            # Competitor list + add
│   │   ├── content/                # Content explorer
│   │   ├── analytics/              # Charts & heatmap
│   │   ├── reports/                # Export reports
│   │   ├── profile/                # My Instagram profile
│   │   └── settings/               # Account, billing, security
│   └── api/
│       └── instagram/connect/      # Instagram OAuth redirect
├── components/
│   ├── Sidebar.tsx                 # Navigation sidebar
│   ├── EngagementChart.tsx         # Recharts line chart
│   ├── PostingHeatmap.tsx          # Hour × day heatmap
│   └── DeleteCompetitorButton.tsx  # Client-side delete
└── lib/
    └── supabase/
        ├── client.ts               # Browser client
        ├── server.ts               # Server client
        └── middleware.ts           # Session refresh
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.local.example .env.local

# 3. Fill in Supabase keys (see API_SETUP_GUIDE.md)

# 4. Run the DB schema in Supabase SQL Editor
# File: supabase-schema.sql

# 5. Start the dev server
npm run dev
```

## API Keys Required

| Key | Purpose | Required |
|-----|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ Yes |
| `INSTAGRAM_CLIENT_ID` | Instagram Graph API | For Instagram connect |
| `INSTAGRAM_CLIENT_SECRET` | Instagram Graph API | For Instagram connect |
| `RAPIDAPI_KEY` | Competitor data scraping | Optional fallback |

See **API_SETUP_GUIDE.md** for detailed step-by-step instructions.

## Monetization

| Plan | Price | Competitors | Features |
|------|-------|------------|---------|
| Free | $0 | 3 | Basic analytics, 30-day history |
| Pro | $19/mo | 20 | Reports, unlimited history, advanced filters |
| Agency | $49/mo | 100 | Team accounts, API access |

## Roadmap

- [ ] Stripe billing integration
- [ ] Instagram Stories tracking
- [ ] AI-powered content insights
- [ ] Hashtag analytics
- [ ] Team collaboration
- [ ] Scheduled report emails
