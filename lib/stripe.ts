import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const getOrCreateCustomer = async (userId: string, email: string) => {
  // Check if customer exists
  // const customers = await stripe.customers.list({ email })
  // if (customers.data.length > 0) return customers.data[0]
  
  // Create new customer
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })
  
  return customer
}

export const createCheckoutSession = async (customerId: string, priceId: string) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
  })
  
  return session
}