'use client'

import { useState } from 'react'
import { Comment } from '@/types'
import Avatar from '@/components/ui/Avatar'
import VoteButtons from '@/components/ui/VoteButtons'
import CommentForm from '@/components/comments/CommentForm'
import { formatDistanceToNow } from 'date-fns'

type CommentItemProps = {
  comment: Comment
  depth?: number
  onRefresh: () => void
}

export default function CommentItem({
  comment,
  depth = 0,
  onRefresh,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <div className={`${depth > 0 ? 'ml-4 border-l border-white/10 pl-4' : ''}`}>
      {/* comment body */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-2">
        {/* header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Avatar name={comment.user?.name ?? 'Unknown'} size="sm" />
            <span className="text-white/60 text-xs font-medium">
              {comment.user?.name ?? 'Unknown'}
            </span>
            <span className="text-white/30 text-xs">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>

          <VoteButtons
            votableType="App\Models\Comment"
            votableId={comment.id}
            initialUpvotes={comment.upvote_count ?? 0}
            initialDownvotes={comment.downvote_count ?? 0}
            userVote={comment.user_vote ?? null}
          />
        </div>

        {/* body */}
        <p className="text-white/70 text-sm leading-relaxed">{comment.body}</p>

        {/* reply button */}
        {depth < 2 && (
          <button
            onClick={() => setShowReplyForm(v => !v)}
            className="mt-2 text-xs text-white/40 hover:text-[#4fffb0] transition-colors"
          >
            {showReplyForm ? 'Cancel' : '↩ Reply'}
          </button>
        )}
      </div>

      {/* reply form */}
      {showReplyForm && (
        <div className="ml-4 mb-2">
          <CommentForm
            commentableId={comment.commentable_id}
            commentableType={comment.commentable_type as 'App\\Models\\Thread' | 'App\\Models\\Protocol'}
            parentId={comment.id}
            placeholder="Write a reply..."
            onSuccess={() => {
              setShowReplyForm(false)
              onRefresh()
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* nested replies */}
      {comment.replies && comment.replies.length > 0 && depth < 2 && (
        <div className="mt-1">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}