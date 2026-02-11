import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Log webhook event
    await supabase.from('webhook_events').insert({
      source: 'stripe',
      event_type: event.type,
      payload: event,
    })

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const userId = session.metadata?.userId
        const customerId = session.customer as string

        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Update subscription
        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const priceId = subscription.items.data[0].price.id
          let planType = 'pro'

          if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_UNLIMITED) {
            planType = 'unlimited'
          }

          if (existingSub) {
            await supabase
              .from('subscriptions')
              .update({
                stripe_customer_id: customerId,
                stripe_subscription_id: subscription.id,
                stripe_price_id: priceId,
                plan_type: planType,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq('user_id', userId)
          } else {
            await supabase.from('subscriptions').insert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: priceId,
              plan_type: planType,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
          }
        } else if (session.mode === 'payment') {
          // One-time payment for credits
          const priceId = session.line_items?.data[0]?.price.id
          
          if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PAYG) {
            // Add 1 credit for pay-as-you-go
            const { data: credits } = await supabase
              .from('credits')
              .select('*')
              .eq('user_id', userId)
              .single()

            if (credits) {
              await supabase
                .from('credits')
                .update({
                  balance: credits.balance + 1,
                  total_earned: credits.total_earned + 1,
                })
                .eq('user_id', userId)
            }

            await supabase.from('credit_transactions').insert({
              user_id: userId,
              amount: 1,
              type: 'purchase',
              description: 'Credit purchase (Pay As You Go)',
              metadata: { stripe_session_id: session.id },
            })
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', subscriptionId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any

        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any

        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan_type: 'starter',
          })
          .eq('stripe_subscription_id', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
