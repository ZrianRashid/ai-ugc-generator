# AI UGC Video Generator SaaS

A professional AI-powered User-Generated Content (UGC) video generator built with Next.js 14, Supabase, and Stripe.

## Features

- 🎥 **AI Video Generation**: Create professional UGC videos from text prompts
- 🔐 **Authentication**: Email/password and Google OAuth via Supabase Auth
- 💳 **Subscriptions**: Multiple pricing tiers with Stripe integration
- 🎨 **Modern UI**: Dark theme with gradient accents and glassmorphism effects
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- ⚡ **Real-time**: Live status updates via polling
- 📊 **Dashboard**: Track credits, subscriptions, and video history

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- n8n instance (for video generation webhook)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-ugc-saas
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables (see Configuration section)

5. Set up the database:
```bash
# Run the schema.sql file in your Supabase SQL Editor
```

6. Run the development server:
```bash
npm run dev
```

### Configuration

#### Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy `Project URL` and `anon/public` key to `.env.local`
4. Copy `service_role` key for server-side operations
5. Go to Authentication → Settings and enable Google OAuth (optional)

#### Stripe

1. Get your API keys from [stripe.com](https://stripe.com)
2. Create products and prices in Stripe Dashboard:
   - Pro Plan: $49/month recurring
   - Unlimited Plan: $149/month recurring
   - Pay As You Go: $5 one-time
3. Copy price IDs to `.env.local`
4. Set up webhook endpoint pointing to `/api/webhooks/stripe`

#### n8n Webhook

Configure your n8n workflow to:
1. Receive webhook calls from `/api/generate`
2. Process video generation
3. Call back to `/api/webhooks/n8n` with status updates

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_PRO=
NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED=
NEXT_PUBLIC_STRIPE_PRICE_PAYG=

# n8n
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Pricing Tiers

| Plan | Price | Videos | Quality | Watermark |
|------|-------|--------|---------|-----------|
| Starter | Free | 1 | 720p | Yes |
| Pro | $49/mo | 20/month | 1080p | No |
| Unlimited | $149/mo | Unlimited | 4K | No |
| Pay As You Go | $5/video | Per credit | 1080p | No |

## Database Schema

### Tables

- `users` - User profiles
- `videos` - Generated video records
- `credits` - User credit balances
- `credit_transactions` - Credit transaction history
- `subscriptions` - Stripe subscription data
- `webhook_events` - Webhook event logging

### Row Level Security

All tables have RLS policies configured for data isolation between users.

## API Routes

- `POST /api/generate` - Start video generation
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/n8n` - n8n completion webhook

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Database
npm run db:generate  # Generate types
npm run db:push      # Push migrations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Support

For support, email support@yourdomain.com or open an issue.
