'use client'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return '12am'
  if (i === 12) return '12pm'
  return i < 12 ? `${i}am` : `${i - 12}pm`
})

interface Props {
  data: number[][] // [day][hour]
}

export default function PostingHeatmap({ data }: Props) {
  const maxVal = Math.max(...data.flat(), 1)

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Hour labels */}
        <div className="flex mb-1 ml-10">
          {HOURS.map((h, i) => (
            <div key={i} className="w-7 text-center text-[9px] text-gray-400">
              {i % 3 === 0 ? h : ''}
            </div>
          ))}
        </div>

        {/* Grid */}
        {DAYS.map((day, di) => (
          <div key={day} className="flex items-center mb-1">
            <div className="w-10 text-xs text-gray-500 text-right pr-2 font-medium">{day}</div>
            {data[di].map((val, hi) => {
              const intensity = val / maxVal
              const alpha = intensity === 0 ? 0 : 0.1 + intensity * 0.9
              return (
                <div
                  key={hi}
                  className="w-7 h-6 rounded-sm mr-px cursor-default transition-all hover:scale-110"
                  style={{
                    backgroundColor: val === 0
                      ? '#f3f4f6'
                      : `rgba(225, 48, 108, ${alpha})`
                  }}
                  title={`${day} ${HOURS[hi]}: ${val} posts`}
                />
              )
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 ml-10">
          <span className="text-xs text-gray-400">Less</span>
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((a, i) => (
            <div
              key={i}
              className="w-5 h-4 rounded-sm"
              style={{ backgroundColor: a === 0 ? '#f3f4f6' : `rgba(225, 48, 108, ${0.1 + a * 0.9})` }}
            />
          ))}
          <span className="text-xs text-gray-400">More</span>
        </div>
      </div>
    </div>
  )
}
