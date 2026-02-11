'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, Loader2, Sparkles, Wand2, Clock, Users, MessageSquare, Target, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface UgcFormProps {
  credits: number
  plan: string
}

const VIDEO_STYLES = [
  { id: 'testimonial', name: 'Testimonial', description: 'Customer review style' },
  { id: 'product_review', name: 'Product Review', description: 'In-depth product showcase' },
  { id: 'unboxing', name: 'Unboxing', description: 'First impressions reveal' },
  { id: 'how_to', name: 'How-To/Tutorial', description: 'Educational content' },
  { id: 'day_in_life', name: 'Day in Life', description: 'Lifestyle integration' },
  { id: 'before_after', name: 'Before & After', description: 'Transformation story' },
]

const TONES = [
  { id: 'enthusiastic', name: 'Enthusiastic', description: 'High energy, excited' },
  { id: 'casual', name: 'Casual', description: 'Relaxed, conversational' },
  { id: 'professional', name: 'Professional', description: 'Polished, authoritative' },
  { id: 'humorous', name: 'Humorous', description: 'Funny, entertaining' },
  { id: 'inspirational', name: 'Inspirational', description: 'Motivational, uplifting' },
]

const DURATIONS = [
  { value: 15, label: '15 sec', description: 'Short & punchy' },
  { value: 30, label: '30 sec', description: 'Standard ad' },
  { value: 60, label: '60 sec', description: 'Detailed review' },
]

export function UgcForm({ credits, plan }: UgcFormProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [step, setStep] = useState(1)
  
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    keyFeatures: '',
    targetAudience: '',
    painPoints: '',
    videoStyle: 'testimonial',
    duration: 30,
    tone: 'enthusiastic',
  })

  const hasEnoughCredits = plan === 'unlimited' || credits > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasEnoughCredits) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    setIsGenerating(true)

    try {
      const prompt = buildPrompt(formData)
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          productName: formData.productName,
          targetAudience: formData.targetAudience,
          videoStyle: formData.videoStyle,
          duration: formData.duration,
          tone: formData.tone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.code === 'NO_CREDITS') {
          toast.error('Insufficient credits. Please upgrade your plan.')
        } else {
          throw new Error(data.error || 'Failed to generate video')
        }
        return
      }

      toast.success('Video generation started! Check your history.')
      router.push('/dashboard/history')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate video')
    } finally {
      setIsGenerating(false)
    }
  }

  const buildPrompt = (data: typeof formData) => {
    return `Create a ${data.tone} ${data.videoStyle.replace('_', ' ')} video for "${data.productName}".

Product Description: ${data.productDescription}

Key Features to Highlight: ${data.keyFeatures}

Target Audience: ${data.targetAudience}

Pain Points Addressed: ${data.painPoints}

Video Duration: ${data.duration} seconds

Style: Authentic user-generated content, natural lighting, casual setting, genuine enthusiasm.`
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Create New Video
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to generate your AI UGC video
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              'flex-1 h-2 rounded-full transition-colors',
              s <= step ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product/Service Name *
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="e.g., GlowSkin Serum"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Description *
              </label>
              <textarea
                value={formData.productDescription}
                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                placeholder="Describe what your product does and its main benefits..."
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Key Features (comma separated)
              </label>
              <input
                type="text"
                value={formData.keyFeatures}
                onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                placeholder="e.g., Organic ingredients, Fast absorption, Cruelty-free"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary"
              />
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.productName || !formData.productDescription}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Audience *
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., Women 25-40 interested in skincare"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Pain Points Addressed
              </label>
              <textarea
                value={formData.painPoints}
                onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                placeholder="What problems does your product solve for customers?"
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.targetAudience}
                className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Video Style */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Video Style *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {VIDEO_STYLES.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, videoStyle: style.id })}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.videoStyle === style.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium text-sm">{style.name}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Video Duration *
              </label>
              <div className="flex gap-2">
                {DURATIONS.map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: duration.value })}
                    className={cn(
                      'flex-1 p-3 rounded-lg border text-center transition-all',
                      formData.duration === duration.value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium text-sm">{duration.label}</div>
                    <div className="text-xs text-muted-foreground">{duration.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Video Tone *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, tone: tone.id })}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      formData.tone === tone.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-medium text-sm">{tone.name}</div>
                    <div className="text-xs text-muted-foreground">{tone.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {!hasEnoughCredits && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Insufficient Credits</p>
                    <p className="text-sm text-destructive/80">
                      You need credits to generate videos.{' '}
                      <Link href="/pricing" className="underline">
                        Upgrade your plan
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isGenerating || !hasEnoughCredits}
                className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Video
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
