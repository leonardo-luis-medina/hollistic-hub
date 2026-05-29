'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type SearchResult = {
  id: string
  title: string
  type: 'protocol' | 'thread'
  slug?: string
}

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const host     = process.env.NEXT_PUBLIC_TYPESENSE_HOST
        const port     = process.env.NEXT_PUBLIC_TYPESENSE_PORT
        const protocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL
        const key      = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY

        const [protocolRes, threadRes] = await Promise.all([
          fetch(`${protocol}://${host}:${port}/collections/protocols/documents/search?q=${encodeURIComponent(query)}&query_by=title,tags&per_page=3`, {
            headers: { 'X-TYPESENSE-API-KEY': key! }
          }),
          fetch(`${protocol}://${host}:${port}/collections/threads/documents/search?q=${encodeURIComponent(query)}&query_by=title&per_page=2`, {
            headers: { 'X-TYPESENSE-API-KEY': key! }
          }),
        ])

        const protocolData = await protocolRes.json()
        const threadData   = await threadRes.json()

        const protocolResults: SearchResult[] = (protocolData.hits ?? []).map((h: any) => ({
          id:    h.document.id,
          title: h.document.title,
          type:  'protocol',
          slug:  h.document.slug,
        }))

        const threadResults: SearchResult[] = (threadData.hits ?? []).map((h: any) => ({
          id:    h.document.id,
          title: h.document.title,
          type:  'thread',
        }))

        setResults([...protocolResults, ...threadResults])
        setIsOpen(true)
        setActiveIndex(-1)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [query])

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && results[activeIndex]) {
        navigateTo(results[activeIndex])
      } else {
        submitSearch()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  function navigateTo(result: SearchResult) {
    setIsOpen(false)
    setQuery('')
    if (result.type === 'protocol') {
      router.push(`/protocols/${result.slug}`)
    } else {
      router.push(`/threads/${result.id}`)
    }
  }

  function submitSearch() {
    if (!query.trim()) return
    setIsOpen(false)
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* input */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-[#4fffb0]/50 transition-colors">
        <svg className="w-4 h-4 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search protocols and threads..."
          className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
        />
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white/20 border-t-[#4fffb0] rounded-full animate-spin shrink-0" />
        )}
      </div>

      {/* dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a1628] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => navigateTo(result)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${activeIndex === index ? 'bg-white/10' : 'hover:bg-white/5'}
              `}
            >
              <span className={`
                text-xs px-2 py-0.5 rounded-full border shrink-0
                ${result.type === 'protocol'
                  ? 'text-[#4fffb0] border-[#4fffb0]/30 bg-[#4fffb0]/10'
                  : 'text-[#00d4ff] border-[#00d4ff]/30 bg-[#00d4ff]/10'}
              `}>
                {result.type}
              </span>
              <span className="text-white/80 text-sm truncate">{result.title}</span>
            </button>
          ))}

          <button
            onClick={submitSearch}
            className="w-full px-4 py-2.5 text-left text-xs text-white/40 hover:text-white/60 hover:bg-white/5 border-t border-white/10 transition-colors"
          >
            Search all results for "{query}" →
          </button>
        </div>
      )}
    </div>
  )
}