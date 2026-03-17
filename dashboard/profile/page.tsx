import { createClient } from '@/lib/supabase/server'
import { Instagram, Link as LinkIcon, Users, Image as ImageIcon, Heart, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: igAccount } = await supabase
    .from('instagram_accounts')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your connected Instagram account analytics</p>
      </div>

      {!igAccount ? (
        /* Connect Instagram */
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-ig-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Instagram className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">Connect your Instagram</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Link your Instagram account to see your personal analytics and benchmark against competitors.
          </p>
          <a
            href="/api/instagram/connect"
            className="btn-primary inline-flex"
          >
            <Instagram className="w-4 h-4" /> Connect Instagram
          </a>
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-sm mx-auto">
            <p className="text-xs text-blue-600 leading-relaxed">
              Requires Instagram Graph API setup. See <code className="bg-blue-100 px-1 rounded">.env.local</code> configuration guide.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="card p-6 text-center">
            {igAccount.profile_picture_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={igAccount.profile_picture_url} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-ig-gradient flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">
                {igAccount.username[0].toUpperCase()}
              </div>
            )}
            <h2 className="font-bold text-gray-900 text-lg">@{igAccount.username}</h2>
            {igAccount.full_name && <p className="text-gray-500 text-sm">{igAccount.full_name}</p>}
            {igAccount.bio && <p className="text-gray-600 text-sm mt-2 leading-relaxed">{igAccount.bio}</p>}
            <a
              href={`https://instagram.com/${igAccount.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full justify-center mt-4 text-sm"
            >
              <LinkIcon className="w-3.5 h-3.5" /> View on Instagram
            </a>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Followers', value: (igAccount.followers_count || 0).toLocaleString(), icon: Users, color: 'text-purple-500' },
                { label: 'Following', value: (igAccount.following_count || 0).toLocaleString(), icon: Users, color: 'text-blue-500' },
                { label: 'Posts', value: (igAccount.media_count || 0).toLocaleString(), icon: ImageIcon, color: 'text-brand-500' },
              ].map(s => (
                <div key={s.label} className="stat-card text-center">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1.5`} />
                  <div className="text-xl font-display font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-brand-500" />
                <h3 className="font-semibold text-gray-900">Account insights</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Account type', value: igAccount.account_type || 'Personal' },
                  { label: 'Last synced', value: igAccount.last_synced_at ? new Date(igAccount.last_synced_at).toLocaleDateString() : 'Never' },
                  { label: 'Connected since', value: new Date(igAccount.connected_at).toLocaleDateString() },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{s.label}</span>
                    <span className="text-sm font-medium text-gray-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
