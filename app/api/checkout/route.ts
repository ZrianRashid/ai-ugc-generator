import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { stripe, getOrCreateCustomer, createCheckoutSession, getPriceIdForPlan } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { planId, priceId } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Missing plan ID' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(
      session.user.id,
      session.user.email!
    )

    // Determine mode based on plan
    const mode = planId === 'payg' ? 'payment' : 'subscription'
    const finalPriceId = priceId || getPriceIdForPlan(planId)

    if (!finalPriceId) {
      return NextResponse.json(
        { error: 'Invalid plan or price not configured' },
        { status: 400 }
      )
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      customerId,
      finalPriceId,
      session.user.id,
      mode
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
