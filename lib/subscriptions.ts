import { createClientClient } from './supabase'

export type PlanType = 'starter' | 'pro' | 'unlimited' | 'payg'

export interface Plan {
  id: PlanType
  name: string
  description: string
  price: number
  priceId: string | null | undefined
  features: string[]
  limits: {
    videosPerMonth: number
    quality: string
    watermark: boolean
  }
}

export interface Subscription {
  id: string
  user_id: string
  plan_type: PlanType
  status: string
  current_period_end?: string
  cancel_at_period_end: boolean
}

export const PLANS: Record<PlanType, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for trying out AI video generation',
    price: 0,
    priceId: null,
    features: [
      '1 free video (watermarked)',
      'Basic video quality',
      'Standard rendering',
      'Community support',
    ],
    limits: {
      videosPerMonth: 1,
      quality: '720p',
      watermark: true,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For creators who need regular video content',
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    features: [
      '20 videos per month',
      '1080p HD quality',
      'No watermark',
      'Priority rendering',
      'Email support',
      'Video history',
    ],
    limits: {
      videosPerMonth: 20,
      quality: '1080p',
      watermark: false,
    },
  },
  unlimited: {
    id: 'unlimited',
    name: 'Unlimited',
    description: 'For agencies and power users',
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED,
    features: [
      'Unlimited videos',
      '4K Ultra HD quality',
      'No watermark',
      'Fastest rendering',
      'Priority support',
      'API access',
      'Custom branding',
    ],
    limits: {
      videosPerMonth: -1, // Unlimited
      quality: '4K',
      watermark: false,
    },
  },
  payg: {
    id: 'payg',
    name: 'Pay As You Go',
    description: 'Buy credits as needed',
    price: 5,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PAYG,
    features: [
      '$5 per video credit',
      '1080p HD quality',
      'No watermark',
      'Credits never expire',
      'Email support',
    ],
    limits: {
      videosPerMonth: -1,
      quality: '1080p',
      watermark: false,
    },
  },
}

export async function getUserSubscription(): Promise<Subscription | null> {
  const supabase = createClientClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function getUserPlan(): Promise<PlanType> {
  const subscription = await getUserSubscription()
  return subscription?.plan_type || 'starter'
}

export function isPlanActive(subscription: Subscription | null): boolean {
  if (!subscription) return false
  return subscription.status === 'active' || subscription.status === 'trialing'
}

export function hasFeature(planType: PlanType, feature: keyof typeof PLANS.starter.limits): boolean {
  const plan = PLANS[planType]
  if (!plan) return false

  switch (feature) {
    case 'watermark':
      return !plan.limits.watermark
    case 'videosPerMonth':
      return true
    case 'quality':
      return true
    default:
      return false
  }
}

export function canGenerateVideo(planType: PlanType, creditsUsed: number, creditsTotal: number): boolean {
  if (planType === 'unlimited') return true
  if (planType === 'pro' && creditsUsed < 20) return true
  if (planType === 'starter' && creditsUsed < 1) return true
  if (planType === 'payg' && creditsTotal > 0) return true
  return false
}
