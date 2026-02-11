export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { UgcForm } from '@/components/ugc-form'
import { getUserCredits } from '@/lib/credits'
import { getUserSubscription, PLANS } from '@/lib/subscriptions'
import { Video, CreditCard, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }

  const [credits, subscription] = await Promise.all([
    getUserCredits(),
    getUserSubscription(),
  ])

  const plan = subscription?.plan_type || 'starter'
  const planDetails = PLANS[plan]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Create professional UGC videos with AI
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Credits</p>
              <p className="text-2xl font-bold">
                {plan === 'unlimited' ? '∞' : credits?.balance || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="text-2xl font-bold">{planDetails.name}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Video className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Videos Created</p>
              <p className="text-2xl font-bold">{credits?.total_used || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Generator */}
        <div className="lg:col-span-2">
          <UgcForm 
            credits={credits?.balance || 0} 
            plan={plan}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/history"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Video className="h-5 w-5 text-muted-foreground" />
                <span>View History</span>
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span>Upgrade Plan</span>
              </Link>
            </div>
          </div>

          {/* Plan Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Your Plan Features</h3>
            <ul className="space-y-2">
              {planDetails.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            {plan !== 'unlimited' && (
              <Link
                href="/pricing"
                className="mt-4 block text-center text-sm text-primary hover:underline"
              >
                Upgrade for more features →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
