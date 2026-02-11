export const dynamic = 'force-dynamic'

import { PricingCard } from '@/components/pricing-card'
import { PLANS } from '@/lib/subscriptions'

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose the plan that works for you. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <PricingCard plan={PLANS.starter} />
        <PricingCard plan={PLANS.pro} popular />
        <PricingCard plan={PLANS.unlimited} />
        <PricingCard plan={PLANS.payg} />
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-24">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const faqs = [
  {
    question: 'What happens when I run out of credits?',
    answer: 'You can purchase additional credits or upgrade to a higher plan. Credits from the Pro plan reset monthly, while Pay As You Go credits never expire.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer: 'Yes, you can cancel anytime from your account settings. You\'ll continue to have access until the end of your billing period.',
  },
  {
    question: 'Do I own the videos I create?',
    answer: 'Yes! All videos you generate come with full commercial usage rights. You can use them anywhere, forever.',
  },
  {
    question: 'What video quality can I export?',
    answer: 'Starter plan includes 720p with watermark. Pro plan includes 1080p HD. Unlimited plan includes up to 4K Ultra HD.',
  },
  {
    question: 'How long does video generation take?',
    answer: 'Most videos are ready within 5-10 minutes. Pro and Unlimited plans get priority rendering for faster processing.',
  },
]
