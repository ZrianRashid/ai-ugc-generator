import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const getOrCreateCustomer = async (userId: string, email: string) => {
  // Check if customer exists
  const customers = await stripe.customers.list({ email })
  if (customers.data.length > 0) return customers.data[0].id
  
  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })
  
  return customer.id
}

export const createCheckoutSession = async (
  customerId: string, 
  priceId: string, 
  userId: string,
  mode: 'subscription' | 'payment' = 'subscription'
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: { userId },
  })
  
  return session
}

export const getPriceIdForPlan = (planId: string): string | null => {
  const priceMap: Record<string, string | undefined> = {
    pro: process.env.STRIPE_PRICE_PRO,
    unlimited: process.env.STRIPE_PRICE_UNLIMITED,
    payg: process.env.STRIPE_PRICE_CREDIT,
  }
  return priceMap[planId] || null
}