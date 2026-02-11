import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, status, videoUrl, error: errorMsg } = body

    if (!videoId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify webhook secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('n8n webhook received:', { videoId, status, videoUrl })

    // TODO: Update video status in database
    // This requires Supabase setup with proper tables

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('n8n webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}