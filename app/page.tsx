import Link from 'next/link'
import { Video, Zap, Shield, CreditCard } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <span className="font-bold text-xl">AI UGC Generator</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-white/70 hover:text-white transition">Sign In</Link>
            <Link href="/auth/register" className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg font-medium transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Generate UGC Ads in Minutes
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Create scroll-stopping UGC video ads with AI. No actors, no cameras, no hassle. 
            Just describe your product and get professional UGC content.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register" className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl font-bold text-lg transition">
              Start Creating Free
            </Link>
            <Link href="#pricing" className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-xl font-bold text-lg transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need for UGC</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Video className="w-8 h-8" />}
              title="AI Video Generation"
              description="Claude Sonnet 4.5 writes scripts, Sora 2 Pro generates videos"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Multiple Angles"
              description="Testimonial, problem-solution, authority, storytime, unboxing"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Full Control"
              description="Customize character, setting, duration, and style"
            />
            <FeatureCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Flexible Pricing"
              description="Free trial, subscriptions, or pay-per-video"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="1" title="Describe Your Product" description="Enter your product name, key benefit, and target audience" />
            <StepCard number="2" title="Choose Your Style" description="Pick an angle, setting, character, and duration" />
            <StepCard number="3" title="Get Your Video" description="AI generates your UGC ad in 3-7 minutes" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-white/60 text-center mb-12">Choose the plan that works for you</p>
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Starter"
              price="Free"
              description="1 video to try it out"
              features={['1 video (watermarked)', 'All UGC angles', '5-15s duration', 'Standard quality']}
              cta="Start Free"
              href="/auth/register"
              popular={false}
            />
            <PricingCard
              name="Pro"
              price="$49"
              period="/month"
              description="For serious marketers"
              features={['20 videos/month', 'No watermark', 'HD quality', 'All settings & angles', 'Priority support']}
              cta="Get Pro"
              href="/auth/register"
              popular={true}
            />
            <PricingCard
              name="Unlimited"
              price="$149"
              period="/month"
              description="For agencies & teams"
              features={['Unlimited videos', 'No watermark', '4K quality', 'API access', 'Priority queue', 'Custom characters']}
              cta="Get Unlimited"
              href="/auth/register"
              popular={false}
            />
          </div>
          <div className="text-center mt-8">
            <p className="text-white/60">Or pay-as-you-go: <span className="text-white font-semibold">$5 per video</span></p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-white/60 mb-8">Generate your first UGC video free. No credit card required.</p>
          <Link href="/auth/register" className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl font-bold text-lg transition">
            Create Free Video →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <span className="font-semibold">AI UGC Generator</span>
          </div>
          <p className="text-white/40 text-sm">© 2024 AI UGC Generator. Built with Claude + Sora 2.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  )
}

function PricingCard({ name, price, period, description, features, cta, href, popular }: any) {
  return (
    <div className={`rounded-2xl p-6 ${popular ? 'bg-indigo-500/10 border-2 border-indigo-500' : 'bg-white/5 border border-white/10'}`}>
      {popular && <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>}
      <h3 className="text-xl font-bold mt-4">{name}</h3>
      <div className="flex items-baseline gap-1 my-2">
        <span className="text-4xl font-bold">{price}</span>
        {period && <span className="text-white/60">{period}</span>}
      </div>
      <p className="text-white/60 text-sm mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <span className="text-green-400">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link href={href} className={`block text-center py-3 rounded-xl font-semibold transition ${
        popular ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-white/10 hover:bg-white/20'
      }`}>
        {cta}
      </Link>
    </div>
  )
}