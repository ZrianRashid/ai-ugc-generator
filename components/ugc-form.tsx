'use client'

import { useState } from 'react'
import Link from 'next/link'

const ANGLES = [
  { value: 'testimonial', label: 'Testimonial', desc: 'Person raving about product' },
  { value: 'problem-solution', label: 'Problem-Solution', desc: '"Tired of X? This fixed it."' },
  { value: 'authority', label: 'Doctor/Expert', desc: 'Authority figure recommends' },
  { value: 'storytime', label: 'Storytime', desc: '"The craziest thing happened..."' },
  { value: 'street-interview', label: 'Street Interview', desc: 'Two people, vox pop style' },
  { value: 'unboxing', label: 'Unboxing / GRWM', desc: 'First impression energy' },
  { value: 'before-after', label: 'Before & After', desc: 'Visual transformation' },
]

const SETTINGS = [
  { value: 'bedroom', label: 'Bedroom', emoji: '🛏️' },
  { value: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { value: 'bathroom', label: 'Bathroom', emoji: '🪞' },
  { value: 'car', label: 'Car', emoji: '🚗' },
  { value: 'street', label: 'Street', emoji: '🏙️' },
  { value: 'doctors-office', label: "Doctor's Office", emoji: '🩺' },
  { value: 'living-room', label: 'Living Room', emoji: '🛋️' },
  { value: 'gym', label: 'Gym', emoji: '💪' },
  { value: 'office', label: 'Office', emoji: '💼' },
]

const GENDERS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]

const ETHNICITIES = [
  { value: 'Caucasian', label: 'Caucasian' },
  { value: 'African American', label: 'African American' },
  { value: 'Hispanic', label: 'Hispanic' },
  { value: 'East Asian', label: 'East Asian' },
  { value: 'South Asian', label: 'South Asian' },
  { value: 'Middle Eastern', label: 'Middle Eastern' },
]

const DURATIONS = [
  { value: '5', label: '5s', desc: 'Quick hook' },
  { value: '10', label: '10s', desc: 'Sweet spot' },
  { value: '15', label: '15s', desc: 'Full pitch' },
]

const AGES = ['20', '25', '28', '32', '35', '40', '45', '50', '55', '60']

export default function UGCForm() {
  const [step, setStep] = useState<'form' | 'generating' | 'result' | 'error'>('form')
  const [elapsed, setElapsed] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    product_name: '',
    product_description: '',
    target_audience: '',
    key_benefit: '',
    ugc_angle: 'testimonial',
    character_gender: 'female',
    character_age: '28',
    character_ethnicity: 'Caucasian',
    setting: 'bedroom',
    duration: '10',
    model: 'sora-2-pro-text-to-video',
    size: 'standard',
  })

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const generate = async () => {
    if (!form.product_name.trim() || !form.key_benefit.trim()) {
      setError('Product name and key benefit are required.')
      return
    }
    setError('')
    setStep('generating')
    
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      clearInterval(timer)

      if (data.status === 'SUCCESS' && data.video_url) {
        setResult(data)
        setStep('result')
      } else {
        setError(data.message || 'Video generation failed.')
        setStep('error')
      }
    } catch (err: any) {
      clearInterval(timer)
      setError('Connection error: ' + err.message)
      setStep('error')
    }
  }

  const reset = () => {
    setStep('form')
    setResult(null)
    setError('')
    setElapsed(0)
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  if (step === 'generating') {
    const messages = [
      'Writing your video script with Claude...',
      'Crafting 5 scroll-stopping hooks...',
      'Building the perfect UGC prompt...',
      'Submitting to Sora 2 Pro...',
      'Rendering your video...',
      'Almost there — adding final touches...',
    ]
    const msgIdx = Math.min(Math.floor(elapsed / 30), messages.length - 1)

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full border-3 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <h2 className="text-2xl font-semibold mb-2">Generating Your Video</h2>
          <p className="text-white/50 mb-6">{messages[msgIdx]}</p>
          <div className="inline-block bg-indigo-500/15 rounded-xl px-6 py-3">
            <span className="text-indigo-400 text-3xl font-bold tabular-nums">{formatTime(elapsed)}</span>
          </div>
          <p className="text-white/30 text-sm mt-4">Sora 2 Pro typically takes 3–7 minutes</p>
        </div>
      </div>
    )
  }

  if (step === 'result' && result) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎬</div>
          <h2 className="text-3xl font-bold mb-2">Your Video is Ready</h2>
          <p className="text-white/50">Generated in {formatTime(elapsed)} • {form.ugc_angle} • {form.duration}s</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-6">
          <video src={result.video_url} controls className="w-full" />
        </div>

        <a
          href={result.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-semibold mb-6 transition"
        >
          ↓ Download Video
        </a>

        {result.hook_variations?.length > 0 && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">🪝 Hook Variations to Test</h3>
            {result.hook_variations.map((hook: string, i: number) => (
              <div key={i} className="bg-indigo-500/10 rounded-lg p-3 mb-3 flex items-center gap-3">
                <span className="text-indigo-400 font-bold min-w-[24px]">{i + 1}</span>
                <span className="text-white/85">{hook}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={reset}
          className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold transition"
        >
          ← Generate Another Video
        </button>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-3">Generation Failed</h2>
          <p className="text-white/50 mb-6">{error}</p>
          <button
            onClick={reset}
            className="px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-4">
        <h3 className="text-lg font-semibold mb-4">📦 Product</h3>
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Product Name *</label>
            <input
              type="text"
              placeholder="e.g. Sleep Gummies, ProstaMax Plus"
              value={form.product_name}
              onChange={(e) => update('product_name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Key Benefit *</label>
            <input
              type="text"
              placeholder="The ONE thing this product does"
              value={form.key_benefit}
              onChange={(e) => update('key_benefit', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Product Description</label>
            <textarea
              placeholder="More details about the product..."
              value={form.product_description}
              onChange={(e) => update('product_description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500 resize-y"
            />
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Target Audience</label>
            <input
              type="text"
              placeholder="Who buys this?"
              value={form.target_audience}
              onChange={(e) => update('target_audience', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-4">
        <h3 className="text-lg font-semibold mb-4">🎭 Creative</h3>
        <div className="mb-4">
          <label className="text-white/70 text-sm font-medium block mb-2">UGC Angle</label>
          <div className="grid grid-cols-2 gap-2">
            {ANGLES.map((a) => (
              <button
                key={a.value}
                onClick={() => update('ugc_angle', a.value)}
                className={`p-3 rounded-xl text-left border transition ${
                  form.ugc_angle === a.value
                    ? 'border-indigo-500 bg-indigo-500/15 text-white'
                    : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="font-semibold text-sm">{a.label}</div>
                <div className="text-xs opacity-60 mt-1">{a.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-white/70 text-sm font-medium block mb-2">Setting</label>
          <div className="flex flex-wrap gap-2">
            {SETTINGS.map((s) => (
              <button
                key={s.value}
                onClick={() => update('setting', s.value)}
                className={`px-4 py-2 rounded-full border transition ${
                  form.setting === s.value
                    ? 'border-indigo-500 bg-indigo-500/15 text-white'
                    : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-white/70 text-sm font-medium block mb-2">Duration</label>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => update('duration', d.value)}
                className={`flex-1 p-3 rounded-xl border transition ${
                  form.duration === d.value
                    ? 'border-indigo-500 bg-indigo-500/15 text-white'
                    : 'border-white/20 bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <div className="font-bold">{d.label}</div>
                <div className="text-xs opacity-60 mt-1">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-4">
        <h3 className="text-lg font-semibold mb-4">👤 Character</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Gender</label>
            <select
              value={form.character_gender}
              onChange={(e) => update('character_gender', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-indigo-500"
            >
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Age</label>
            <select
              value={form.character_age}
              onChange={(e) => update('character_age', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-indigo-500"
            >
              {AGES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/70 text-sm font-medium block mb-2">Ethnicity</label>
            <select
              value={form.character_ethnicity}
              onChange={(e) => update('character_ethnicity', e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-indigo-500"
            >
              {ETHNICITIES.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/15 border border-red-500/30 rounded-xl p-4 mb-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={generate}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition"
      >
        🎬 Generate UGC Video
      </button>
      <p className="text-center text-white/30 text-sm mt-3">Takes 3–7 minutes • Powered by Claude + Sora 2 Pro</p>
    </div>
  )
}