import { createClient } from '@/lib/supabase/server'
import { Users, Image as ImageIcon, Heart, MessageCircle, Eye, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: competitors } = await supabase
    .from('competitors')
    .select('*, competitor_posts(likes_count, comments_count, views_count)')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .order('added_at', { ascending: false })

  const { data: topPosts } = await supabase
    .from('competitor_posts')
    .select('*, competitors!inner(username, profile_picture_url, user_id)')
    .eq('competitors.user_id', user!.id)
    .order('likes_count', { ascending: false })
    .limit(6)

  const totalPosts = competitors?.reduce((acc, c) => acc + (c.competitor_posts?.length || 0), 0) || 0
  const avgLikes = competitors?.length
    ? Math.round(competitors.flatMap(c => c.competitor_posts).reduce((acc: number, p: any) => acc + (p?.likes_count || 0), 0) / Math.max(totalPosts, 1))
    : 0
  const avgComments = competitors?.length
    ? Math.round(competitors.flatMap(c => c.competitor_posts).reduce((acc: number, p: any) => acc + (p?.comments_count || 0), 0) / Math.max(totalPosts, 1))
    : 0

  const stats = [
    { label: 'Competitors tracked', value: competitors?.length || 0, icon: Users, color: 'bg-purple-50 text-purple-500', change: null },
    { label: 'Posts analyzed', value: totalPosts.toLocaleString(), icon: Image, color: 'bg-blue-50 text-blue-500', change: null },
    { label: 'Avg. likes', value: avgLikes.toLocaleString(), icon: Heart, color: 'bg-brand-50 text-brand-500', change: null },
    { label: 'Avg. comments', value: avgComments.toLocaleString(), icon: MessageCircle, color: 'bg-orange-50 text-orange-500', change: null },
  ]

  const hasCompetitors = (competitors?.length || 0) > 0

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your competitor intelligence overview</p>
        </div>
        <Link href="/dashboard/competitors/add" className="btn-primary">
          <Plus className="w-4 h-4" /> Add competitor
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-display font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {!hasCompetitors ? (
        /* Empty state */
        <div className="card p-16 text-center">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">Start tracking competitors</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Add Instagram accounts to monitor their posts, reels, and engagement metrics all in one place.
          </p>
          <Link href="/dashboard/competitors/add" className="btn-primary inline-flex">
            <Plus className="w-4 h-4" /> Add your first competitor
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Top performing content</h2>
              <Link href="/dashboard/content" className="text-sm text-brand-500 hover:text-brand-600 font-medium">View all →</Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(topPosts || []).map((post: any) => (
                <div key={post.id} className="post-card">
                  {post.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                  <div className="post-overlay">
                    <div className="flex items-center gap-3 text-white text-xs w-full">
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{(post.likes_count || 0).toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(post.views_count || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {(topPosts?.length || 0) === 0 && Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl skeleton"></div>
              ))}
            </div>
          </div>

          {/* Competitor leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Competitors</h2>
              <Link href="/dashboard/competitors" className="text-sm text-brand-500 hover:text-brand-600 font-medium">Manage →</Link>
            </div>
            <div className="card divide-y divide-gray-50">
              {(competitors || []).map((c: any, i: number) => (
                <div key={c.id} className="flex items-center gap-3 p-3.5 hover:bg-gray-50/50 transition-colors">
                  <span className="text-xs text-gray-400 w-4 font-medium">{i + 1}</span>
                  {c.profile_picture_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.profile_picture_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-ig-gradient flex items-center justify-center text-white text-xs font-bold">
                      {c.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">@{c.username}</p>
                    <p className="text-xs text-gray-400">{(c.followers_count || 0).toLocaleString()} followers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
