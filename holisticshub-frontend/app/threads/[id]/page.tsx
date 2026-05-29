import { Thread, Comment } from '@/types'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Avatar from '@/components/ui/Avatar'
import TagBadge from '@/components/ui/TagBadge'
import VoteButtons from '@/components/ui/VoteButtons'
import CommentTree from '@/components/comments/CommentTree'
import CommentSection from '@/components/threads/CommentSection'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

async function getThread(id: string): Promise<Thread | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/threads/${id}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getComments(id: string): Promise<Comment[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/threads/${id}/comments`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.data ?? []
  } catch {
    return []
  }
}

export default async function ThreadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const thread = await getThread(params.id)
  if (!thread) notFound()

  const comments = await getComments(params.id)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-8">

      {/* back link */}
      {thread.protocol && (
        <Link
          href={`/protocols/${thread.protocol.slug}`}
          className="text-[#4fffb0] text-sm hover:underline"
        >
          ← Back to {thread.protocol.title}
        </Link>
      )}

      {/* header */}
      <div className="flex flex-col gap-4">
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {thread.tags.map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff]">
          {thread.title}
        </h1>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Avatar name={thread.user?.name ?? 'Unknown'} size="sm" />
            <span className="text-white/50 text-sm">{thread.user?.name}</span>
          </div>
          <span className="text-white/30 text-sm">
            {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
          </span>
          <span className="text-white/30 text-sm">👁 {thread.views ?? 0} views</span>
        </div>

        {/* vote buttons */}
        <VoteButtons
          votableType="App\Models\Thread"
          votableId={thread.id}
          initialUpvotes={thread.upvote_count ?? 0}
          initialDownvotes={thread.downvote_count ?? 0}
        />
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
          {thread.body}
        </ReactMarkdown>
      </div>

      {/* comments */}
      <CommentSection
        threadId={thread.id}
        initialComments={comments}
      />

    </div>
  )
}