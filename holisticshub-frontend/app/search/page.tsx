'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ProtocolCard from '@/components/protocols/ProtocolCard'
import ThreadCard from '@/components/threads/ThreadCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { Protocol, Thread } from '@/types'

type Tab = 'protocols' | 'threads'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const [activeTab, setActiveTab]       = useState<Tab>('protocols')
  const [protocols, setProtocols]       = useState<Protocol[]>([])
  const [threads, setThreads]           = useState<Thread[]>([])
  const [isLoading, setIsLoading]       = useState(false)

  useEffect(() => {
    if (!q.trim()) return

    async function search() {
      setIsLoading(true)
      try {
        const host     = process.env.NEXT_PUBLIC_TYPESENSE_HOST
        const port     = process.env.NEXT_PUBLIC_TYPESENSE_PORT
        const protocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL
        const key      = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_KEY

        const [protocolRes, threadRes] = await Promise.all([
          fetch(`${protocol}://${host}:${port}/collections/protocols/documents/search?q=${encodeURIComponent(q)}&query_by=title,tags&per_page=20`, {
            headers: { 'X-TYPESENSE-API-KEY': key! }
          }),
          fetch(`${protocol}://${host}:${port}/collections/threads/documents/search?q=${encodeURIComponent(q)}&query_by=title&per_page=20`, {
            headers: { 'X-TYPESENSE-API-KEY': key! }
          }),
        ])

        const protocolData = await protocolRes.json()
        const threadData   = await threadRes.json()

        setProtocols((protocolData.hits ?? []).map((h: any) => h.document))
        setThreads((threadData.hits ?? []).map((h: any) => h.document))
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* header */}
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff] mb-2">
          Search Results
        </h1>
        {q && (
          <p className="text-white/40 text-sm">
            Showing results for <span className="text-white/70">"{q}"</span>
          </p>
        )}
      </div>

      {/* tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-0">
        {(['protocols', 'threads'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 text-sm font-medium capitalize border-b-2 transition-all
              ${activeTab === tab
                ? 'border-[#4fffb0] text-[#4fffb0]'
                : 'border-transparent text-white/40 hover:text-white/70'}
            `}
          >
            {tab} ({tab === 'protocols' ? protocols.length : threads.length})
          </button>
        ))}
      </div>

      {/* results */}
      {!q ? (
        <p className="text-white/40 text-center py-12">Enter a search term to get started.</p>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : activeTab === 'protocols' ? (
        protocols.length === 0 ? (
          <p className="text-white/40 text-center py-12">No protocols found for "{q}".</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.map(p => <ProtocolCard key={p.id} protocol={p} />)}
          </div>
        )
      ) : (
        threads.length === 0 ? (
          <p className="text-white/40 text-center py-12">No threads found for "{q}".</p>
        ) : (
          <div className="flex flex-col gap-4">
            {threads.map(t => <ThreadCard key={t.id} thread={t} />)}
          </div>
        )
      )}

    </div>
  )
}