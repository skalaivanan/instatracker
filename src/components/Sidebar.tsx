'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, Users, Grid3X3, BarChart2,
  FileText, UserCircle, Settings, LogOut, Instagram,
  Zap
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/competitors', icon: Users, label: 'Competitors' },
  { href: '/dashboard/content', icon: Grid3X3, label: 'Content Explorer' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { href: '/dashboard/profile', icon: UserCircle, label: 'My Profile' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ user, profile }: { user: any; profile: any }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const planColors: Record<string, string> = {
    free: 'bg-gray-100 text-gray-500',
    pro: 'bg-purple-100 text-purple-600',
    agency: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-ig-gradient flex items-center justify-center shadow-sm">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-gray-900 text-base">InstaTrack</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                isActive
                  ? 'bg-brand-50 text-brand-600 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={clsx('w-4 h-4', isActive ? 'text-brand-500' : 'text-gray-400')} strokeWidth={isActive ? 2 : 1.75} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade banner */}
      {profile?.plan === 'free' && (
        <div className="mx-3 mb-3 p-3.5 bg-gradient-to-br from-brand-50 to-purple-50 rounded-xl border border-brand-100">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-xs font-semibold text-brand-600">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-2.5">Track 20 competitors & unlock advanced analytics.</p>
          <Link href="/dashboard/settings?tab=billing" className="btn-primary text-xs py-1.5 px-3 w-full justify-center">
            Upgrade — $19/mo
          </Link>
        </div>
      )}

      {/* User */}
      <div className="border-t border-gray-50 p-3">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
          {user?.user_metadata?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-ig-gradient flex items-center justify-center text-white text-xs font-semibold">
              {(profile?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{profile?.full_name || user?.email?.split('@')[0]}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${planColors[profile?.plan || 'free']}`}>
              {(profile?.plan || 'free').charAt(0).toUpperCase() + (profile?.plan || 'free').slice(1)}
            </span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
