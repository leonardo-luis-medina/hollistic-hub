import Link from 'next/link'
import { Protocol, Thread } from '@/types'
import ProtocolCard from '@/components/protocols/ProtocolCard'
import ThreadCard from '@/components/threads/ThreadCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SearchBar from '@/components/search/SearchBar'

async function getFeaturedProtocols(): Promise<Protocol[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/protocols?sort=top_rated&per_page=6`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}

async function getRecentThreads(): Promise<Thread[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/threads?sort=latest&per_page=5`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}

const ALL_TAGS = [
  'nutrition', 'sleep', 'mental-health', 'exercise', 'breathwork',
  'supplements', 'fasting', 'recovery', 'detox', 'mindfulness',
  'cold-therapy', 'gut-health',
]

export default async function HomePage() {
  const [protocols, threads] = await Promise.all([
    getFeaturedProtocols(),
    getRecentThreads(),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16">

      {/* hero */}
      <section className="flex flex-col items-center text-center gap-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff]">
            Heal Better,
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4fffb0] to-[#00d4ff]">
            Together.
          </span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl">
          Browse structured wellness protocols, join discussions, and share what works for you.
        </p>
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
        <div className="flex gap-3">
          <Link
            href="/protocols"
            className="px-5 py-2.5 rounded-lg font-medium bg-[#4fffb0] text-[#0a1628] hover:bg-[#4fffb0]/90 transition-colors"
          >
            Browse Protocols
          </Link>
          <Link
            href="/threads"
            className="px-5 py-2.5 rounded-lg font-medium border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all"
          >
            View Threads
          </Link>
        </div>
      </section>

      {/* featured protocols */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff]">
            Featured Protocols
          </h2>
          <Link href="/protocols" className="text-[#4fffb0] text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocols.length === 0
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : protocols.map(p => <ProtocolCard key={p.id} protocol={p} />)
          }
        </div>
      </section>

      {/* recent threads */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff]">
            Recent Threads
          </h2>
          <Link href="/threads" className="text-[#4fffb0] text-sm hover:underline">
            View all →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {threads.length === 0
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : threads.map(t => <ThreadCard key={t.id} thread={t} />)
          }
        </div>
      </section>

      {/* tag cloud */}
      <section>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff] mb-6">
          Browse by Topic
        </h2>
        <div className="flex flex-wrap gap-3">
          {ALL_TAGS.map(tag => (
            <Link
              key={tag}
              href={`/protocols?tag=${tag}`}
              className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm hover:border-[#4fffb0]/50 hover:text-[#4fffb0] transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}