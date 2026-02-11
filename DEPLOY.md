# Quick Deployment Guide

## 1. Supabase Setup

1. Create new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor → New Query
3. Copy contents of `supabase/schema.sql` and run
4. Go to Settings → API → Copy URL and anon key

## 2. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Create products:
   - Pro Subscription: $49/month recurring
   - Unlimited Subscription: $149/month recurring  
   - Credit Pack: $5 one-time
3. Copy price IDs to environment variables
4. Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
5. Copy webhook secret to environment variables

## 3. n8n Setup

1. Import `n8n/ugc-saas-v6.json` into your n8n instance
2. Update API keys in the workflow:
   - Anthropic Claude API key
   - Kie.ai API key
3. Activate the workflow
4. Copy webhook URL to environment variables

## 4. Vercel Deployment

1. Push code to GitHub
2. Import project to [vercel.com](https://vercel.com)
3. Add environment variables from `.env.example`
4. Deploy

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO=
STRIPE_PRICE_UNLIMITED=
STRIPE_PRICE_CREDIT=

# n8n
N8N_WEBHOOK_URL=

# App
NEXT_PUBLIC_APP_URL=
```

## Post-Deploy Checklist

- [ ] Test user registration
- [ ] Test video generation
- [ ] Test Stripe checkout
- [ ] Verify webhook handling
- [ ] Test credit deduction
- [ ] Check video history page