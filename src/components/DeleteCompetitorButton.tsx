'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2 } from 'lucide-react'

export default function DeleteCompetitorButton({ competitorId }: { competitorId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from('competitors').update({ is_active: false }).eq('id', competitorId)
    router.refresh()
    setLoading(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button onClick={handleDelete} disabled={loading} className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition-colors">
          {loading ? '…' : 'Delete'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-500 px-2 py-1">Cancel</button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="btn-ghost p-1.5 hover:text-red-500">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}
