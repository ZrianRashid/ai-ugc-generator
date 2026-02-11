# Netlify Deployment Guide

## Option 1: GitHub Integration (Recommended)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select `ai-ugc-generator` repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Deploy"

## Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd ai-ugc-saas
netlify deploy --prod
```

## Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
N8N_WEBHOOK_URL=https://n8n.srv804414.hstgr.cloud/webhook/ugc-app
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

## Post-Deploy

1. Update Supabase Auth redirect URLs:
   - Go to Supabase → Auth → URL Configuration
   - Add: `https://your-site.netlify.app/auth/callback`

2. Update Stripe webhook endpoint:
   - Go to Stripe Dashboard → Webhooks
   - Add: `https://your-site.netlify.app/api/webhooks/stripe`