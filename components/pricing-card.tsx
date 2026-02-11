'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlanType, Plan } from '@/lib/subscriptions'

interface PricingCardProps {
  plan: Plan
  popular?: boolean
}

export function PricingCard({ plan, popular }: PricingCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    if (plan.id === 'starter') {
      router.push('/auth/register')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          priceId: plan.priceId,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Loading...'
    if (plan.id === 'starter') return 'Get Started Free'
    if (plan.id === 'payg') return 'Buy Credits'
    return 'Subscribe'
  }

  return (
    <div
      className={cn(
        'relative rounded-2xl border p-6 flex flex-col',
        popular
          ? 'border-primary bg-primary/5 scale-105'
          : 'border-border bg-card'
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
            <Sparkles className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">
            ${plan.price}
          </span>
          {plan.id !== 'payg' && plan.price > 0 && (
            <span className="text-muted-foreground">/mo</span>
          )}
          {plan.id === 'payg' && (
            <span className="text-muted-foreground">/video</span>
          )}
        </div>
        {plan.id === 'starter' && (
          <p className="text-sm text-muted-foreground mt-1">Forever free</p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <Check className={cn(
              'h-4 w-4 mt-0.5 shrink-0',
              popular ? 'text-primary' : 'text-muted-foreground'
            )} />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={cn(
          'w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
          popular
            ? 'bg-primary text-white hover:bg-primary-600'
            : 'border border-border bg-background hover:bg-muted'
        )}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {getButtonText()}
      </button>
    </div>
  )
}
