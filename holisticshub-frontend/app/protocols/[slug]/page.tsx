import { Protocol, Thread, Review } from '@/types'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Avatar from '@/components/ui/Avatar'
import TagBadge from '@/components/ui/TagBadge'
import StarRating from '@/components/ui/StarRating'
import ThreadCard from '@/components/threads/ThreadCard'
import ReviewSection from '@/components/protocols/ReviewSection'
import { formatDistanceToNow } from 'date-fns'

async function getProtocol(slug: string): Promise<Protocol | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/protocols/${slug}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getThreads(protocolId: number): Promise<Thread[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/protocols/${protocolId}/threads`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}

async function getReviews(protocolId: number): Promise<Review[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/protocols/${protocolId}/reviews`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}

export default async function ProtocolDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const protocol = await getProtocol(params.slug)
  if (!protocol) notFound()

  const [threads, reviews] = await Promise.all([
    getThreads(protocol.id),
    getReviews(protocol.id),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">

      {/* header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {protocol.tags?.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff]">
          {protocol.title}
        </h1>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Avatar name={protocol.user?.name ?? 'Unknown'} size="sm" />
            <span className="text-white/50 text-sm">{protocol.user?.name}</span>
          </div>
          <span className="text-white/30 text-sm">
            {formatDistanceToNow(new Date(protocol.created_at), { addSuffix: true })}
          </span>
          <span className="text-white/30 text-sm">👁 {protocol.views ?? 0} views</span>
          <div className="flex items-center gap-2">
            <StarRating value={protocol.avg_rating ?? 0} readonly size="sm" />
            <span className="text-white/30 text-sm">({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* markdown body */}
      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-[#00d4ff]
        prose-a:text-[#4fffb0]
        prose-strong:text-white
        prose-code:text-[#a78bfa]
        prose-blockquote:border-[#4fffb0]
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {protocol.content}
        </ReactMarkdown>
      </div>

      {/* reviews */}
      <ReviewSection
        protocolId={protocol.id}
        initialReviews={reviews}
      />

      {/* linked threads */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">
          Discussions ({threads.length})
        </h2>
        {threads.length === 0 ? (
          <p className="text-white/30 text-sm">No threads yet for this protocol.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {threads.map(t => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
      </section>

    </div>
  )
}