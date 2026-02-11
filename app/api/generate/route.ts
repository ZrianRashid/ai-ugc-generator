import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

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

    const body = await request.json()
    const { prompt, productName, targetAudience, videoStyle, duration, tone } = body

    if (!prompt || !productName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user has enough credits
    const { data: credits } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', session.user.id)
      .single()

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', session.user.id)
      .single()

    const plan = subscription?.plan_type || 'starter'
    
    // Unlimited plan bypasses credit check
    if (plan !== 'unlimited' && (!credits || credits.balance < 1)) {
      return NextResponse.json(
        { error: 'Insufficient credits', code: 'NO_CREDITS' },
        { status: 402 }
      )
    }

    // Create video record
    const { data: video, error: videoError } = await supabase
      .from('videos')
      .insert({
        user_id: session.user.id,
        title: `${productName} - ${videoStyle}`,
        prompt,
        status: 'pending',
        settings: {
          productName,
          targetAudience,
          videoStyle,
          duration,
          tone,
        },
      })
      .select()
      .single()

    if (videoError) {
      console.error('Error creating video:', videoError)
      return NextResponse.json(
        { error: 'Failed to create video' },
        { status: 500 }
      )
    }

    // Call n8n webhook
    const webhookUrl = process.env.N8N_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            videoId: video.id,
            userId: session.user.id,
            prompt,
            productName,
            targetAudience,
            videoStyle,
            duration,
            tone,
            webhookSecret: process.env.N8N_WEBHOOK_SECRET,
          }),
        })
      } catch (webhookError) {
        console.error('Webhook error:', webhookError)
        // Continue even if webhook fails - we'll have the video record
      }
    }

    return NextResponse.json({
      success: true,
      video: {
        id: video.id,
        status: video.status,
      },
    })
  } catch (error) {
    console.error('Generate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
