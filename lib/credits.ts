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
  // TODO: Implement with Supabase
  return null
}

export async function getCreditTransactions(limit = 20): Promise<CreditTransaction[]> {
  // TODO: Implement with Supabase
  return []
}

export async function addCredits(
  userId: string, 
  amount: number, 
  type: CreditTransaction['type'],
  description: string,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  // TODO: Implement with Supabase
  console.log('Add credits:', { userId, amount, type, description })
  return true
}

export async function hasEnoughCredits(): Promise<boolean> {
  // TODO: Implement with Supabase
  return true
}

export function formatCredits(balance: number): string {
  if (balance === 0) return '0'
  return balance.toString()
}