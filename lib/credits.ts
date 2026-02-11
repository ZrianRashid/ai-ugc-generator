import { createClientClient } from './supabase'

export interface Credits {
  id: string
  user_id: string
  balance: number
  total_earned: number
  total_used: number
}

export interface CreditTransaction {
  id: string
  user_id: string
  amount: number
  type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'subscription'
  description: string
  video_id?: string
  created_at: string
}

export async function getUserCredits(): Promise<Credits | null> {
  const supabase = createClientClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function getCreditTransactions(limit = 20): Promise<CreditTransaction[]> {
  const supabase = createClientClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}

export async function addCredits(
  userId: string, 
  amount: number, 
  type: CreditTransaction['type'],
  description: string,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const supabase = createClientClient()

  // Add credits
  const { error: creditError } = await supabase
    .from('credits')
    .update({
      balance: supabase.rpc('increment', { x: amount }),
      total_earned: supabase.rpc('increment', { x: amount }),
    })
    .eq('user_id', userId)

  if (creditError) {
    console.error('Error adding credits:', creditError)
    return false
  }

  // Record transaction
  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      description,
      metadata,
    })

  if (transactionError) {
    console.error('Error recording transaction:', transactionError)
    return false
  }

  return true
}

export async function hasEnoughCredits(): Promise<boolean> {
  const credits = await getUserCredits()
  if (!credits) return false
  
  // Check subscription plan for unlimited
  const supabase = createClientClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type')
    .eq('user_id', user.id)
    .single()

  // Unlimited plan always has credits
  if (subscription?.plan_type === 'unlimited') {
    return true
  }

  return credits.balance > 0
}

export function formatCredits(balance: number): string {
  if (balance === 0) return '0'
  return balance.toString()
}
