'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Search, ArrowLeft, AlertCircle, CheckCircle, Instagram, Users, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function AddCompetitorPage() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<any>(null)
  const [adding, setAdding] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setLoading(true)
    setError('')
    setPreview(null)

    const clean = username.replace('@', '').trim().toLowerCase()

    // Check if already added
    const { data: { user } } = await supabase.auth.getUser()
    const { data: existing } = await supabase
      .from('competitors')
      .select('id')
      .eq('user_id', user!.id)
      .eq('username', clean)
      .single()

    if (existing) {
      setError('This competitor is already in your list.')
      setLoading(false)
      return
    }

    // Mock preview — in production, call Instagram API / RapidAPI
    // The real fetch would hit: /api/instagram/profile?username=clean
    setPreview({
      username: clean,
      display_name: clean.charAt(0).toUpperCase() + clean.slice(1),
      followers_count: Math.floor(Math.random() * 500000) + 5000,
      media_count: Math.floor(Math.random() * 500) + 10,
      bio: `Instagram profile for @${clean}`,
      profile_picture_url: null,
    })
    setLoading(false)
  }

  const handleAdd = async () => {
    if (!preview) return
    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()

    // Check plan limit
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user!.id).single()
    const { count } = await supabase.from('competitors').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('is_active', true)
    const limits: Record<string, number> = { free: 3, pro: 20, agency: 100 }
    const max = limits[profile?.plan || 'free']
    if ((count || 0) >= max) {
      setError(`You've reached your ${profile?.plan || 'free'} plan limit. Please upgrade.`)
      setAdding(false)
      return
    }

    const { error } = await supabase.from('competitors').insert({
      user_id: user!.id,
      username: preview.username,
      display_name: preview.display_name,
      followers_count: preview.followers_count,
      media_count: preview.media_count,
      bio: preview.bio,
      profile_picture_url: preview.profile_picture_url,
    })

    if (error) { setError(error.message); setAdding(false) }
    else router.push('/dashboard/competitors')
  }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
      <Link href="/dashboard/competitors" className="btn-ghost inline-flex mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to competitors
      </Link>

      <h1 className="text-2xl font-display font-bold text-gray-900 mb-1">Add a competitor</h1>
      <p className="text-gray-500 text-sm mb-8">Enter their Instagram username to start tracking.</p>

      <div className="card p-6 mb-5">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value.replace('@', ''))}
              className="input pl-7"
            />
          </div>
          <button type="submit" disabled={loading || !username} className="btn-primary px-5">
            <Search className="w-4 h-4" />
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-600 border border-red-100 rounded-xl px-3.5 py-3 text-sm mt-4">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="card p-6 animate-slide-up">
          <div className="flex items-start gap-4 mb-5">
            {preview.profile_picture_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.profile_picture_url} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-ig-gradient flex items-center justify-center text-white text-2xl font-bold">
                {preview.username[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <Instagram className="w-4 h-4 text-brand-500" />
                <h3 className="font-bold text-gray-900 text-lg">@{preview.username}</h3>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              {preview.display_name && <p className="text-gray-500 text-sm">{preview.display_name}</p>}
              {preview.bio && <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">{preview.bio}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3.5 text-center">
              <Users className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <div className="font-bold text-gray-900">{preview.followers_count?.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5 text-center">
              <ImageIcon className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <div className="font-bold text-gray-900">{preview.media_count}</div>
              <div className="text-xs text-gray-400">Posts</div>
            </div>
          </div>

          <button onClick={handleAdd} disabled={adding} className="btn-primary w-full justify-center">
            {adding ? 'Adding…' : `Add @${preview.username} to competitors`}
          </button>
        </div>
      )}

      {/* Help */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm font-medium text-blue-700 mb-1.5">Instagram API required</p>
        <p className="text-xs text-blue-600 leading-relaxed">
          To fetch real profile data, configure your Instagram Graph API credentials in <code className="bg-blue-100 px-1 rounded">.env.local</code>. See the setup guide for instructions.
        </p>
      </div>
    </div>
  )
}
