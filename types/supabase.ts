export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          user_id: string
          title: string | null
          prompt: string
          script: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          video_url: string | null
          thumbnail_url: string | null
          duration: number | null
          settings: Json
          error_message: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          prompt: string
          script?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          settings?: Json
          error_message?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          prompt?: string
          script?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          duration?: number | null
          settings?: Json
          error_message?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      credits: {
        Row: {
          id: string
          user_id: string
          balance: number
          total_earned: number
          total_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          total_earned?: number
          total_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          total_earned?: number
          total_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'subscription'
          description: string
          video_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'purchase' | 'usage' | 'bonus' | 'refund' | 'subscription'
          description: string
          video_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'purchase' | 'usage' | 'bonus' | 'refund' | 'subscription'
          description?: string
          video_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          plan_type: 'starter' | 'pro' | 'unlimited' | 'payg'
          status: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'unpaid'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          plan_type: 'starter' | 'pro' | 'unlimited' | 'payg'
          status?: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          plan_type?: 'starter' | 'pro' | 'unlimited' | 'payg'
          status?: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'unpaid'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      webhook_events: {
        Row: {
          id: string
          source: string
          event_type: string
          payload: Json
          processed: boolean
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source: string
          event_type: string
          payload: Json
          processed?: boolean
          error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source?: string
          event_type?: string
          payload?: Json
          processed?: boolean
          error?: string | null
          created_at?: string
        }
      }
    }
  }
}
