import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Users, Heart, ExternalLink, Trash2 } from 'lucide-react'
import DeleteCompetitorButton from '@/components/DeleteCompetitorButton'

export default async function CompetitorsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*, competitor_posts(likes_count, comments_count, views_count)')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .order('added_at', { ascending: false })

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user!.id).single()
  const limits: Record<string, number> = { free: 3, pro: 20, agency: 100 }
  const maxCompetitors = limits[profile?.plan || 'free']
  const current = competitors?.length || 0
  const canAdd = current < maxCompetitors

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Competitors</h1>
          <p className="text-gray-500 text-sm mt-0.5">{current} of {maxCompetitors} slots used</p>
        </div>
        <Link href={canAdd ? '/dashboard/competitors/add' : '/dashboard/settings?tab=billing'} className="btn-primary">
          <Plus className="w-4 h-4" />
          {canAdd ? 'Add competitor' : `Upgrade for more`}
        </Link>
      </div>

      {/* Progress bar */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Competitor slots</span>
          <span className="text-sm text-gray-500">{current}/{maxCompetitors}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-ig-gradient rounded-full transition-all duration-500"
            style={{ width: `${(current / maxCompetitors) * 100}%` }}
          />
        </div>
        {!canAdd && (
          <p className="text-xs text-brand-600 mt-2 font-medium">
            You've reached your plan limit. <Link href="/dashboard/settings?tab=billing" className="underline">Upgrade to add more.</Link>
          </p>
        )}
      </div>

      {competitors?.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">No competitors yet</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">Add Instagram accounts to start monitoring their content and engagement.</p>
          <Link href="/dashboard/competitors/add" className="btn-primary inline-flex">
            <Plus className="w-4 h-4" /> Add competitor
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {competitors.map((c: any) => {
            const posts = c.competitor_posts || []
            const avgLikes = posts.length ? Math.round(posts.reduce((a: number, p: any) => a + (p.likes_count || 0), 0) / posts.length) : 0
            return (
              <div key={c.id} className="card p-5 hover:shadow-card-hover transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {c.profile_picture_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.profile_picture_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-ig-gradient flex items-center justify-center text-white font-bold text-lg">
                        {c.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gray-900">@{c.username}</p>
                        {c.is_verified && <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-[8px]">✓</span></div>}
                      </div>
                      {c.display_name && <p className="text-xs text-gray-500">{c.display_name}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={`https://instagram.com/${c.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost p-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <DeleteCompetitorButton competitorId={c.id} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Followers', value: formatNum(c.followers_count) },
                    { label: 'Posts', value: posts.length },
                    { label: 'Avg. likes', value: formatNum(avgLikes) },
                  ].map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-2.5">
                      <div className="text-sm font-bold text-gray-900">{s.value}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {c.bio && <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">{c.bio}</p>}

                <Link
                  href={`/dashboard/content?competitor=${c.username}`}
                  className="btn-secondary w-full justify-center mt-4 text-xs py-2"
                >
                  <Heart className="w-3.5 h-3.5" /> View content
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}
