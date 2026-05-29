'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Protocol } from '@/types'
import ProtocolCard from '@/components/protocols/ProtocolCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SearchFilters from '@/components/search/SearchFilters'

export default function ProtocolsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)

  const sort = searchParams.get('sort') ?? 'latest'
  const tag  = searchParams.get('tag') ?? ''
  const q    = searchParams.get('q') ?? ''

  useEffect(() => {
    async function fetchProtocols() {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (sort) params.set('sort', sort)
        if (tag)  params.set('tag', tag)
        if (q)    params.set('search', q)
        params.set('page', String(currentPage))

        const res  = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/protocols?${params.toString()}`
        )
        const data = await res.json()
        setProtocols(data.data ?? [])
        setLastPage(data.last_page ?? 1)
        setTotal(data.total ?? 0)
      } catch {
        setProtocols([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchProtocols()
  }, [sort, tag, q, currentPage])

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    setCurrentPage(1)
    router.push(`/protocols?${params.toString()}`)
  }

  function handleTagToggle(clickedTag: string) {
    updateParams('tag', tag === clickedTag ? '' : clickedTag)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* header */}
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff] mb-2">
          Wellness Protocols
        </h1>
        <p className="text-white/40 text-sm">{total} protocols available</p>
      </div>

      {/* filters */}
      <SearchFilters
        sort={sort}
        onSortChange={v => updateParams('sort', v)}
        selectedTags={tag ? [tag] : []}
        onTagToggle={handleTagToggle}
      />

      {/* grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : protocols.length === 0
            ? <p className="text-white/40 col-span-3 text-center py-12">No protocols found.</p>
            : protocols.map(p => <ProtocolCard key={p.id} protocol={p} />)
        }
      </div>

      {/* pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            ← Prev
          </button>

          <span className="text-white/40 text-sm">
            Page {currentPage} of {lastPage}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, lastPage))}
            disabled={currentPage === lastPage}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  )
}