import { Instagram } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-ig-gradient flex items-center justify-center shadow-glow">
          <Instagram className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-display font-bold text-gray-900">InstaTrack</span>
      </Link>
      {children}
    </div>
  )
}
