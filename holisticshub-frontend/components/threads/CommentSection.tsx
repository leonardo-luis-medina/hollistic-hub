'use client'

import { useState } from 'react'
import { Comment } from '@/types'
import CommentTree from '@/components/comments/CommentTree'
import CommentForm from '@/components/comments/CommentForm'
import api from '@/lib/api'

type CommentSectionProps = {
  threadId: number
  initialComments: Comment[]
}

export default function CommentSection({ threadId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  async function refreshComments() {
    try {
      const res  = await api.get(`/threads/${threadId}/comments`)
      setComments(res.data.data ?? [])
    } catch {
      console.error('Failed to refresh comments')
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white">
        Comments ({comments.length})
      </h2>

      {/* comment form */}
      <CommentForm
        commentableId={threadId}
        commentableType="App\Models\Thread"
        onSuccess={refreshComments}
      />

      {/* comment tree */}
      <CommentTree
        comments={comments}
        onRefresh={refreshComments}
      />
    </section>
  )
}