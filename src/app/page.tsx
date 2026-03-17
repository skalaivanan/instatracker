import Link from 'next/link'
import { TrendingUp, Users, BarChart3, Zap, Shield, Clock, ChevronRight, Instagram, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-ig-gradient flex items-center justify-center">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-gray-900 text-lg tracking-tight">InstaTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">Log in</Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">Start free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-brand-100">
            <Zap className="w-3.5 h-3.5" />
            Track competitors in real-time
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 leading-tight mb-6">
            Outsmart your Instagram<br />
            <span className="ig-text">competition</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track competitor profiles, discover viral content, and identify winning strategies — all in one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/auth/signup" className="btn-primary text-base px-6 py-3 shadow-glow">
              Get started free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/auth/login" className="btn-secondary text-base px-6 py-3">
              Sign in
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required · Free plan available</p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/60">
            <div className="bg-gray-900 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="flex-1 mx-4 bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400">app.instatrack.io/dashboard</div>
            </div>
            <div className="bg-gray-50 p-8">
              {/* Mock Dashboard */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Competitors', value: '8', color: 'bg-purple-500' },
                  { label: 'Posts analyzed', value: '1,247', color: 'bg-pink-500' },
                  { label: 'Avg. likes', value: '4,820', color: 'bg-orange-500' },
                  { label: 'Avg. engagement', value: '3.8%', color: 'bg-brand-500' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className={`w-8 h-8 ${s.color} rounded-lg mb-3`}></div>
                    <div className="text-xl font-bold text-gray-900">{s.value}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-gray-200 rounded-xl aspect-square animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Everything you need to stay ahead</h2>
            <p className="text-gray-500 text-lg">Powerful competitor intelligence tools built for creators and marketers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Competitor Tracking', desc: 'Add up to 100 competitors and monitor their every post, reel, and story in real-time.', color: 'text-purple-600 bg-purple-50' },
              { icon: TrendingUp, title: 'Viral Content Discovery', desc: 'Instantly find top-performing posts with powerful engagement filters and date ranges.', color: 'text-brand-600 bg-brand-50' },
              { icon: BarChart3, title: 'Deep Analytics', desc: 'Heatmaps, posting frequency charts, and engagement trends give you actionable insights.', color: 'text-orange-600 bg-orange-50' },
              { icon: Clock, title: 'Best Posting Times', desc: 'Discover when your competitors get the most engagement so you can post smarter.', color: 'text-green-600 bg-green-50' },
              { icon: Zap, title: 'Real-time Updates', desc: 'Data refreshes every 30 minutes so you never miss a trending post.', color: 'text-yellow-600 bg-yellow-50' },
              { icon: Shield, title: 'Secure & Private', desc: 'OAuth authentication, encrypted tokens, and Supabase RLS to keep your data safe.', color: 'text-blue-600 bg-blue-50' },
            ].map((f) => (
              <div key={f.title} className="card p-6 hover:shadow-card-hover transition-shadow duration-200">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-500 text-lg">Start free, upgrade when you need more.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['3 competitors', '30 days data', 'Content explorer', 'Basic analytics'], cta: 'Get started', highlight: false },
              { name: 'Pro', price: '$19', period: '/month', features: ['20 competitors', 'Unlimited history', 'Advanced filters', 'Export reports', 'Priority support'], cta: 'Start Pro trial', highlight: true },
              { name: 'Agency', price: '$49', period: '/month', features: ['100 competitors', 'Team accounts', 'API access', 'Advanced analytics', 'White-label reports'], cta: 'Contact us', highlight: false },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-6 border-2 ${plan.highlight ? 'border-brand-400 bg-brand-50 shadow-glow' : 'border-gray-100 bg-white'}`}>
                {plan.highlight && (
                  <div className="flex items-center gap-1 text-brand-600 text-xs font-semibold mb-3">
                    <Star className="w-3 h-3 fill-current" /> Most popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2 mb-5">
                  <span className="text-3xl font-display font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className={plan.highlight ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-ig-gradient flex items-center justify-center">
              <Instagram className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">InstaTrack</span>
          </div>
          <p className="text-sm text-gray-400">© 2024 InstaTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
