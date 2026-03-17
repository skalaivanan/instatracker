'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Props {
  data: { date: string; avgLikes: number; avgComments: number; posts: number }[]
}

export default function EngagementChart({ data }: Props) {
  const formatted = data.map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          formatter={(val: number, name: string) => [val.toLocaleString(), name === 'avgLikes' ? 'Avg Likes' : 'Avg Comments']}
        />
        <Legend
          iconType="circle"
          iconSize={6}
          formatter={(val) => <span style={{ fontSize: '11px', color: '#6b7280' }}>{val === 'avgLikes' ? 'Avg Likes' : 'Avg Comments'}</span>}
        />
        <Line type="monotone" dataKey="avgLikes" stroke="#e1306c" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="avgComments" stroke="#833ab4" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
