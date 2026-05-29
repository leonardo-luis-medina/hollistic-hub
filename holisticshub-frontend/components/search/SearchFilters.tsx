'use client'

type SortOption = {
  value: string
  label: string
}

type SearchFiltersProps = {
  sort: string
  onSortChange: (value: string) => void
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  sortOptions?: SortOption[]
}

const ALL_TAGS = [
  'nutrition', 'sleep', 'mental-health', 'exercise', 'breathwork',
  'supplements', 'fasting', 'recovery', 'detox', 'mindfulness',
  'cold-therapy', 'gut-health',
]

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'latest',         label: 'Latest' },
  { value: 'top_rated',      label: 'Top Rated' },
  { value: 'most_reviewed',  label: 'Most Reviewed' },
  { value: 'most_upvoted',   label: 'Most Upvoted' },
]

export default function SearchFilters({
  sort,
  onSortChange,
  selectedTags,
  onTagToggle,
  sortOptions = DEFAULT_SORT_OPTIONS,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* sort dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-sm">Sort:</span>
        <select
          value={sort}
          onChange={e => onSortChange(e.target.value)}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#4fffb0]/50"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0a1628]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* tag chips */}
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map(tag => {
          const active = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`
                px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all
                ${active
                  ? 'bg-[#4fffb0]/20 border-[#4fffb0]/50 text-[#4fffb0]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'}
              `}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}