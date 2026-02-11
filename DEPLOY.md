# Deployment Guide

This guide walks you through deploying the AI UGC Video Generator SaaS to production.

## Deploy to Vercel

### 1. Prepare Your Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin <your-github-url>
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the following:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or your subdirectory)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables (see below)
6. Click "Deploy"

### 3. Environment Variables on Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_PRO=
NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED=
NEXT_PUBLIC_STRIPE_PRICE_PAYG=
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

**Note**: `NEXT_PUBLIC_APP_URL` should be your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Set a name and database password
5. Select a region close to your users
6. Wait for the project to be created

### 2. Run Schema

1. Go to SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql`
4. Run the query

### 3. Get API Keys

1. Go to Project Settings → API
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 4. Enable Auth Providers (Optional)

For Google OAuth:
1. Go to Authentication → Providers
2. Enable Google
3. Add your Google OAuth credentials
4. Set callback URL to: `https://your-app.vercel.app/auth/callback`

### 5. Configure Email Templates

1. Go to Authentication → Email Templates
2. Customize the confirmation email template
3. Set Site URL to your production URL

## Stripe Setup

### 1. Create Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete verification to accept payments

### 2. Create Products and Prices

1. Go to Products → Add Product
2. Create the following products:

#### Pro Plan
- Name: "Pro"
- Description: "20 videos per month"
- Price: $49/month (Recurring)

#### Unlimited Plan
- Name: "Unlimited"
- Description: "Unlimited videos"
- Price: $149/month (Recurring)

#### Pay As You Go
- Name: "Pay As You Go"
- Description: "1 video credit"
- Price: $5 (One-time)

3. Copy the Price IDs (they start with `price_`)
4. Add them to your environment variables:
   - `NEXT_PUBLIC_STRIPE_PRICE_PRO`
   - `NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED`
   - `NEXT_PUBLIC_STRIPE_PRICE_PAYG`

### 3. Set Up Webhook

1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Copy the Signing Secret → `STRIPE_WEBHOOK_SECRET`

### 4. Get API Keys

1. Go to Developers → API Keys
2. Copy:
   - Publishable key → `STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

## n8n Configuration

### 1. Set Up Webhook

Configure your n8n workflow to:

1. **Trigger**: Webhook node
   - Method: POST
   - Path: `/ugc-app`
   - Authentication: Header with secret

2. **Process**: Your video generation logic
   - Parse the incoming data
   - Generate video using your AI/video service

3. **Callback**: HTTP Request node
   - Method: POST
   - URL: `https://your-app.vercel.app/api/webhooks/n8n`
   - Headers: `Authorization: Bearer YOUR_N8N_WEBHOOK_SECRET`
   - Body:
     ```json
     {
       "videoId": "{{$json.videoId}}",
       "status": "completed",
       "videoUrl": "https://your-cdn.com/video.mp4",
       "thumbnailUrl": "https://your-cdn.com/thumb.jpg",
       "script": "Generated script text",
       "duration": 30
     }
     ```

### 2. Set Secret

Generate a secure random string for `N8N_WEBHOOK_SECRET` and add it to both n8n and Vercel.

## Post-Deployment Checklist

### Test Authentication
- [ ] Sign up with email
- [ ] Verify email confirmation
- [ ] Sign in with email
- [ ] Sign in with Google (if enabled)
- [ ] Sign out

### Test Video Generation
- [ ] Create a video (uses 1 credit)
- [ ] Check video appears in history
- [ ] Verify status updates work
- [ ] Download completed video

### Test Payments
- [ ] Upgrade to Pro plan
- [ ] Check subscription updates
- [ ] Verify credits reset monthly
- [ ] Test Pay As You Go purchase
- [ ] Cancel subscription

### Test Webhooks
- [ ] Verify Stripe webhooks are working
- [ ] Verify n8n callback updates video status
- [ ] Check webhook_events table for logs

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Connection Issues
- Check Supabase URL and keys
- Verify Row Level Security policies
- Check connection pooling settings

### Stripe Webhook Failures
- Verify webhook endpoint URL
- Check webhook secret is correct
- Review webhook logs in Stripe Dashboard

### n8n Webhook Issues
- Verify n8n is accessible
- Check webhook secret matches
- Review n8n execution logs

## Production Checklist

Before launching:

- [ ] All environment variables set in Vercel
- [ ] Database schema deployed
- [ ] Stripe products created and webhooks configured
- [ ] n8n workflow tested end-to-end
- [ ] Email templates customized
- [ ] Privacy Policy and Terms pages created
- [ ] Analytics configured (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

## Domain Configuration

To use a custom domain:

1. Buy domain from registrar (e.g., Namecheap, Cloudflare)
2. In Vercel Dashboard:
   - Go to Project Settings → Domains
   - Add your domain
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (can take up to 48 hours)
5. Update `NEXT_PUBLIC_APP_URL` with your custom domain

## Monitoring

Set up monitoring for:
- Vercel Analytics (built-in)
- Supabase usage and performance
- Stripe payment failures
- n8n workflow errors

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Stripe: [stripe.com/support](https://stripe.com/support)
