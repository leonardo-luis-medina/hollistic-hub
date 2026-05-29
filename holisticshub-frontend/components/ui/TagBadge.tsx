type TagBadgeProps = {
  tag: string
  onClick?: () => void
}

const tagColors: Record<string, string> = {
  nutrition:    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  sleep:        'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'mental-health': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  breathwork:   'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  supplements:  'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  fasting:      'bg-orange-500/20 text-orange-300 border-orange-500/30',
  recovery:     'bg-pink-500/20 text-pink-300 border-pink-500/30',
  detox:        'bg-teal-500/20 text-teal-300 border-teal-500/30',
  mindfulness:  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'cold-therapy': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  'gut-health': 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  exercise:     'bg-red-500/20 text-red-300 border-red-500/30',
}

const defaultColor = 'bg-white/10 text-white/60 border-white/20'

export default function TagBadge({ tag, onClick }: TagBadgeProps) {
  const colorClass = tagColors[tag] ?? defaultColor

  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        border ${colorClass}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
      `}
    >
      {tag}
    </span>
  )
}