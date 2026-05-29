import Link from 'next/link'
import { Thread } from '@/types'
import TagBadge from '@/components/ui/TagBadge'
import Avatar from '@/components/ui/Avatar'
import VoteButtons from '@/components/ui/VoteButtons'

type ThreadCardProps = {
  thread: Thread
}

export default function ThreadCard({ thread }: ThreadCardProps) {
  return (
    <div className="
      rounded-xl border border-white/10 bg-white/5 p-5
      hover:border-[#00d4ff]/30 hover:bg-white/8
      transition-all duration-200
    ">
      {/* author + protocol badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar name={thread.user?.name ?? 'Unknown'} size="sm" />
          <span className="text-white/50 text-xs">{thread.user?.name ?? 'Unknown'}</span>
        </div>
        {thread.protocol && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-[#4fffb0]/30 bg-[#4fffb0]/10 text-[#4fffb0] truncate max-w-[140px]">
            {thread.protocol.title}
          </span>
        )}
      </div>

      {/* title — only this is clickable */}
      <Link href={`/threads/${thread.id}`}>
        <h3 className="
          text-white font-semibold text-base mb-2 line-clamp-2
          hover:text-[#00d4ff] transition-colors cursor-pointer
        ">
          {thread.title}
        </h3>
      </Link>

      {/* excerpt */}
      <p className="text-white/40 text-sm line-clamp-2 mb-4">
        {thread.body?.replace(/[#*`]/g, '').slice(0, 120)}...
      </p>

      {/* tags */}
      {thread.tags && thread.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {thread.tags.slice(0, 3).map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* footer */}
      <div className="flex items-center gap-4">
        <VoteButtons
          votableType="App\Models\Thread"
          votableId={thread.id}
          initialUpvotes={thread.upvote_count ?? 0}
          initialDownvotes={thread.downvote_count ?? 0}
        />
        <span className="text-white/40 text-xs">👁 {thread.views ?? 0}</span>
      </div>
    </div>
  )
}