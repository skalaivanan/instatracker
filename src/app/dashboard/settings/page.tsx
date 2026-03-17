import { createClient } from '@/lib/supabase/server'
import { User, Shield, CreditCard, Zap } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Account */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Account</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Full name</label>
              <input className="input" defaultValue={profile?.full_name || ''} placeholder="Your name" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
              <input className="input" value={user?.email || ''} disabled readOnly />
            </div>
            <button className="btn-primary text-sm">Save changes</button>
          </div>
        </div>

        {/* Security */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Two-factor authentication</p>
                <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security with TOTP</p>
              </div>
              <button className="btn-secondary text-xs py-1.5">Enable 2FA</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Change password</p>
                <p className="text-xs text-gray-500 mt-0.5">Send a password reset email</p>
              </div>
              <button className="btn-secondary text-xs py-1.5">Send reset</button>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="card p-6" id="billing">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Plan & billing</h2>
          </div>

          <div className="flex items-center gap-3 mb-5 p-4 bg-gray-50 rounded-xl">
            <div className="flex-1">
              <p className="font-semibold text-gray-900 capitalize">{profile?.plan || 'Free'} Plan</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {profile?.plan === 'free' ? '3 competitors · 30 days history' :
                 profile?.plan === 'pro' ? '20 competitors · Unlimited history' :
                 '100 competitors · Team accounts'}
              </p>
            </div>
            <span className={`badge ${profile?.plan === 'free' ? 'badge-free' : profile?.plan === 'pro' ? 'badge-pro' : 'badge-agency'}`}>
              {(profile?.plan || 'free').toUpperCase()}
            </span>
          </div>

          {profile?.plan === 'free' && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Upgrade your plan</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Pro', price: '$19/mo', features: ['20 competitors', 'Unlimited history', 'Reports & exports'] },
                  { name: 'Agency', price: '$49/mo', features: ['100 competitors', 'Team accounts', 'API access'] },
                ].map(p => (
                  <div key={p.name} className="border-2 border-gray-200 rounded-xl p-4 hover:border-brand-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{p.name}</span>
                      <span className="text-brand-600 font-bold text-sm">{p.price}</span>
                    </div>
                    <ul className="space-y-1">
                      {p.features.map(f => (
                        <li key={f} className="text-xs text-gray-500 flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-green-400"></div>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="btn-primary w-full justify-center mt-3 text-xs py-1.5">
                      <Zap className="w-3 h-3" /> Upgrade
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="card p-6 border-red-100">
          <h2 className="font-semibold text-red-600 mb-3">Danger zone</h2>
          <p className="text-sm text-gray-500 mb-3">Deleting your account will remove all your data permanently.</p>
          <button className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 text-sm">
            Delete account
          </button>
        </div>
      </div>
    </div>
  )
}
