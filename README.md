# AI UGC Video Generator SaaS

Generate scroll-stopping UGC ad videos in minutes with AI. Powered by Claude Sonnet 4.5 + Sora 2 Pro.

## Features

- 🤖 AI-powered video generation (Claude + Sora 2 Pro)
- 🎬 Multiple UGC angles: Testimonial, Problem-Solution, Authority, Storytime, Unboxing
- 👤 Customizable characters: gender, age, ethnicity
- 🎨 9 different settings: bedroom, kitchen, gym, office, etc.
- 💳 Credit-based pricing + subscription plans
- 📹 Video history & download
- 🔐 Supabase auth (email + Google OAuth)
- 💰 Stripe payments

## Pricing

| Plan | Price | Videos | Features |
|------|-------|--------|----------|
| Starter | Free | 1 | Watermarked |
| Pro | $49/mo | 20 | HD, no watermark |
| Unlimited | $149/mo | Unlimited | Priority queue, API access |
| Pay-as-you-go | $5 each | Per video | No subscription |

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes, n8n workflows
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **AI:** Anthropic Claude + Sora 2 Pro via Kie.ai

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/ZrianRashid/ai-ugc-generator.git
cd ai-ugc-generator
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# n8n Webhook
N8N_WEBHOOK_URL=https://n8n.srv804414.hstgr.cloud/webhook/ugc-app

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

### 4. Stripe Setup

1. Create products in Stripe Dashboard:
   - Pro Subscription: $49/month
   - Unlimited Subscription: $149/month
   - Credit Pack: $5 (one-time)

2. Copy price IDs to environment variables

3. Configure webhook endpoint: `/api/webhooks/stripe`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Supabase

1. Create new project
2. Run schema.sql
3. Enable Auth (Email + Google OAuth)
4. Copy credentials to env vars

## n8n Workflow

The backend uses n8n for video generation orchestration:

1. Import `n8n/ugc-saas-v6.json` into your n8n instance
2. Update API keys (Anthropic + Kie.ai)
3. Activate workflow
4. Update webhook URL in environment

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Create video generation |
| `/api/webhooks/stripe` | POST | Stripe webhook handler |
| `/api/videos` | GET | List user's videos |
| `/api/credits` | GET | Get credit balance |

## License

MIT - Built by [Zrian Rashid](https://github.com/ZrianRashid)