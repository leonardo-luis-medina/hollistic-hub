'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import toast from 'react-hot-toast'

type CommentFormProps = {
  commentableId: number
  commentableType: 'App\\Models\\Thread' | 'App\\Models\\Protocol'
  parentId?: number
  onSuccess: () => void
  onCancel?: () => void
  placeholder?: string
}

export default function CommentForm({
  commentableId,
  commentableType,
  parentId,
  onSuccess,
  onCancel,
  placeholder = 'Write a comment...',
}: CommentFormProps) {
  const { isLoggedIn } = useAuthStore()
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!body.trim()) return
    setIsSubmitting(true)
    setError('')

    try {
      await api.post('/comments', {
        body,
        commentable_id:   commentableId,
        commentable_type: commentableType,
        parent_id:        parentId ?? null,
      })
      setBody('')
      toast.success('Comment posted!')
      onSuccess()
    } catch {
      setError('Failed to post comment. Please try again.')
      toast.error('Failed to post comment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <p className="text-white/40 text-sm">
        <a href="/auth/login" className="text-[#4fffb0] hover:underline">Log in</a> to leave a comment.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="
          w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3
          text-white text-sm placeholder-white/30
          focus:outline-none focus:border-[#4fffb0]/50
          resize-none transition-colors
        "
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !body.trim()}
          className="
            px-4 py-1.5 rounded-lg text-sm font-medium
            bg-[#4fffb0] text-[#0a1628]
            hover:bg-[#4fffb0]/90 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}