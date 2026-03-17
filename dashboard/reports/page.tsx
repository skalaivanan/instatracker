import { createClient } from '@/lib/supabase/server'
import { FileText, Download, TrendingUp, Users } from 'lucide-react'

export default async function ReportsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user!.id).single()
  const isPro = profile?.plan === 'pro' || profile?.plan === 'agency'

  const { data: competitors } = await supabase
    .from('competitors')
    .select('username, followers_count')
    .eq('user_id', user!.id)
    .eq('is_active', true)

  await supabase
    .from('competitor_posts')
    .select('id', { count: 'exact' })
    .in('competitor_id', competitors?.map((c: any) => c.id) || [])

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 text-sm mt-0.5">Export competitor analytics and performance data</p>
      </div>

      {!isPro ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">Reports require Pro plan</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Upgrade to Pro to export PDF and CSV reports, competitor performance summaries, and shareable dashboard links.
          </p>
          <a href="/dashboard/settings?tab=billing" className="btn-primary inline-flex">Upgrade to Pro — $19/mo</a>
        </div>
      ) : (
        <div className="space-y-4">
          {[
            {
              title: 'Competitor Performance Report',
              desc: 'Overview of all competitor follower counts, posting frequency, and engagement metrics.',
              icon: Users,
              format: 'PDF',
              color: 'bg-brand-50 text-brand-500',
            },
            {
              title: 'Content Trends Report',
              desc: 'Top performing posts, reels, and optimal posting times for your tracked competitors.',
              icon: TrendingUp,
              format: 'PDF',
              color: 'bg-purple-50 text-purple-500',
            },
            {
              title: 'Raw Data Export',
              desc: 'Full dataset of all tracked posts including likes, comments, views, and captions.',
              icon: FileText,
              format: 'CSV',
              color: 'bg-green-50 text-green-500',
            },
          ].map((r) => (
            <div key={r.title} className="card p-5 flex items-center gap-5">
              <div className={`w-12 h-12 rounded-xl ${r.color} flex items-center justify-center flex-shrink-0`}>
                <r.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{r.desc}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${r.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  {r.format}
                </span>
                <button className="btn-secondary text-sm py-2">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            </div>
          ))}

          <div className="card p-5 bg-gray-50 border-dashed">
            <p className="text-sm text-gray-500 text-center">
              📊 Report generation coming soon. Data is tracked and ready to export.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
