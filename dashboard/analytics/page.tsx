import { createClient } from '@/lib/supabase/server'
import EngagementChart from '@/components/EngagementChart'
import PostingHeatmap from '@/components/PostingHeatmap'

export default async function AnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: competitors } = await supabase
    .from('competitors')
    .select('id, username, followers_count')
    .eq('user_id', user!.id)
    .eq('is_active', true)

  const competitorIds = competitors?.map(c => c.id) || []

  const { data: posts } = await supabase
    .from('competitor_posts')
    .select('competitor_id, likes_count, comments_count, views_count, posted_at, post_type')
    .in('competitor_id', competitorIds)
    .order('posted_at', { ascending: true })
    .limit(500)

  // Build engagement trend (last 30 days bucketed by day)
  const trend: Record<string, { likes: number; comments: number; count: number }> = {}
  posts?.forEach(p => {
    if (!p.posted_at) return
    const day = p.posted_at.slice(0, 10)
    if (!trend[day]) trend[day] = { likes: 0, comments: 0, count: 0 }
    trend[day].likes += p.likes_count || 0
    trend[day].comments += p.comments_count || 0
    trend[day].count += 1
  })
  const trendData = Object.entries(trend).map(([date, d]) => ({
    date,
    avgLikes: d.count ? Math.round(d.likes / d.count) : 0,
    avgComments: d.count ? Math.round(d.comments / d.count) : 0,
    posts: d.count,
  })).slice(-30)

  // Heatmap: hour × dayOfWeek
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0))
  posts?.forEach(p => {
    if (!p.posted_at) return
    const d = new Date(p.posted_at)
    heatmap[d.getDay()][d.getHours()]++
  })

  // Type breakdown
  const typeBreakdown = posts?.reduce((acc: Record<string, number>, p) => {
    const t = p.post_type || 'IMAGE'
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {})

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Deep insights into competitor performance</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total posts tracked', value: (posts?.length || 0).toLocaleString(), color: 'bg-purple-50 text-purple-600' },
          { label: 'Avg. likes / post', value: posts?.length ? Math.round(posts.reduce((a, p) => a + (p.likes_count || 0), 0) / posts.length).toLocaleString() : '0', color: 'bg-brand-50 text-brand-600' },
          { label: 'Avg. comments / post', value: posts?.length ? Math.round(posts.reduce((a, p) => a + (p.comments_count || 0), 0) / posts.length).toLocaleString() : '0', color: 'bg-blue-50 text-blue-600' },
          { label: 'Reels tracked', value: (posts?.filter(p => p.post_type === 'REEL').length || 0).toLocaleString(), color: 'bg-orange-50 text-orange-600' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`text-2xl font-display font-bold ${s.color.split(' ')[1]}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Engagement trend */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Engagement trend</h2>
          <p className="text-xs text-gray-400 mb-4">Average likes & comments per day (last 30 days)</p>
          {trendData.length > 0 ? (
            <EngagementChart data={trendData} />
          ) : (
            <div className="h-48 flex items-center justify-center text-sm text-gray-400">
              No data yet. Add competitors to see trends.
            </div>
          )}
        </div>

        {/* Content type breakdown */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Content type breakdown</h2>
          <div className="space-y-3">
            {Object.entries(typeBreakdown || {}).map(([type, count]) => {
              const total = posts?.length || 1
              const pct = Math.round((count / total) * 100)
              const colors: Record<string, string> = {
                IMAGE: 'bg-blue-400', REEL: 'bg-brand-500', VIDEO: 'bg-purple-400', CAROUSEL_ALBUM: 'bg-orange-400'
              }
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">{type.replace('_', ' ')}</span>
                    <span className="text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[type] || 'bg-gray-400'} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            {!typeBreakdown || Object.keys(typeBreakdown).length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center">No post data available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Posting heatmap */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-1">Posting time heatmap</h2>
        <p className="text-xs text-gray-400 mb-5">When do competitors post most? (darker = more posts)</p>
        <PostingHeatmap data={heatmap} />
      </div>
    </div>
  )
}
