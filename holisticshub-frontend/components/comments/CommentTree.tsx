import CommentItem from '@/components/comments/CommentItem'
import { Comment } from '@/types'

type CommentTreeProps = {
  comments: Comment[]
  onRefresh: () => void
}

export default function CommentTree({ comments, onRefresh }: CommentTreeProps) {
  if (comments.length === 0) {
    return (
      <p className="text-white/30 text-sm text-center py-8">
        No comments yet. Be the first!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          depth={0}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )
}