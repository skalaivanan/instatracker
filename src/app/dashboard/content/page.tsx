'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart, MessageCircle, Eye, Filter, Play } from 'lucide-react'
import Link from 'next/link'

export default function ContentExplorerPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const [posts, setPosts] = useState<any[]>([])
  const [competitors, setCompetitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const competitor = searchParams.get('competitor') || ''
  const type = searchParams.get('type') || 'all'
  const sort = searchParams.get('sort') || 'likes'
  const days = searchParams.get('days') || '30'

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: comps } = await supabase
        .from('competitors')
        .select('id, username')
        .eq('user_id', user.id)
        .eq('is_active', true)

      setCompetitors(comps || [])

      let query = supabase
        .from('competitor_posts')
        .select('*, competitors!inner(username, profile_picture_url, user_id)')
        .eq('competitors.user_id', user.id)

      if (competitor) {
        const c = comps?.find((x: any) => x.username === competitor)
        if (c) query = (query as any).eq('competitor_id', c.id)
      }

      if (type && type !== 'all') {
        query = (query as any).eq('post_type', type.toUpperCase())
      }

      const since = new Date()
      since.setDate(since.getDate() - parseInt(days))
      query = (query as any).gte('posted_at', since.toISOString())

      const sortField = sort === 'comments' ? 'comments_count'
        : sort === 'views' ? 'views_count'
        : 'likes_count'
      const { data } = await (query as any).order(sortField, { ascending: false }).limit(60)

      setPosts(data || [])
      setLoading(false)
    }
    load()
  }, [competitor, type, sort, days])

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/dashboard/content?${params.toString()}`)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Content Explorer</h1>
          <p className="text-gray-500 text-sm mt-0.5">{loading ? 'Loading…' : `${posts.length} posts found`}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 card">
        <Filter className="w-4 h-4 text-gray-400" />
        <select value={competitor} onChange={e => updateParam('competitor', e.target.value)} className="input w-auto py-1.5 text-sm">
          <option value="">All competitors</option>
          {competitors.map((c: any) => (
            <option key={c.id} value={c.username}>@{c.username}</option>
          ))}
        </select>
        <div className="flex gap-1">
          {[['all', 'All'], ['image', 'Posts'], ['reel', 'Reels']].map(([val, label]) => (
            <button key={val} onClick={() => updateParam('type', val)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === val ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {label}
            </button>
          ))}
        </div>
        <select value={sort} onChange={e => updateParam('sort', e.target.value)} className="input w-auto py-1.5 text-sm ml-auto">
          <option value="likes">Most liked</option>
          <option value="comments">Most commented</option>
          <option value="views">Most viewed</option>
        </select>
        <select value={days} onChange={e => updateParam('days', e.target.value)} className="input w-auto py-1.5 text-sm">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {loading ? (
        <div className="content-grid">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square rounded-xl skeleton" />)}</div>
      ) : posts.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-gray-500">No posts found for the selected filters.</p>
          {competitors.length === 0 && <Link href="/dashboard/competitors/add" className="btn-primary inline-flex mt-4">Add a competitor first</Link>}
        </div>
      ) : (
        <div className="content-grid">
          {posts.map((post: any) => (
            <div key={post.id} className="post-card group">
              {post.thumbnail_url
                ? <img src={post.thumbnail_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                : <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">📷</div>
              }
              {(post.post_type === 'REEL' || post.post_type === 'VIDEO') && (
                <div className="absolute top-2 right-2 bg-black/60 text-white rounded-lg p-1"><Play className="w-3 h-3 fill-white" /></div>
              )}
              <div className="post-overlay">
                <div className="w-full">
                  <div className="text-xs text-gray-300 mb-1">@{post.competitors?.username}</div>
                  <div className="flex items-center gap-3 text-white text-xs">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 fill-white" />{formatNum(post.likes_count || 0)}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{formatNum(post.comments_count || 0)}</span>
                    {post.views_count > 0 && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNum(post.views_count)}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}
