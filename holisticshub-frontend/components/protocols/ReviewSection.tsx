'use client'

import { useState } from 'react'
import { Review } from '@/types'
import { useAuthStore } from '@/lib/auth'
import Avatar from '@/components/ui/Avatar'
import StarRating from '@/components/ui/StarRating'
import api from '@/lib/api'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

type ReviewSectionProps = {
  protocolId: number
  initialReviews: Review[]
}

export default function ReviewSection({ protocolId, initialReviews }: ReviewSectionProps) {
  const { isLoggedIn } = useAuthStore()
  const [reviews, setReviews]       = useState<Review[]>(initialReviews)
  const [rating, setRating]         = useState(0)
  const [body, setBody]             = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]           = useState('')

  async function handleSubmit() {
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      const res = await api.post(`/protocols/${protocolId}/reviews`, { rating, body })
      setReviews(prev => [res.data, ...prev])
        setRating(0)
        setBody('')
        toast.success('Review submitted!')
    } catch {
      setError('Failed to submit review. You may have already reviewed this protocol.')
        toast.error('Failed to submit review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-white">Reviews ({reviews.length})</h2>

      {/* review form */}
      {isLoggedIn ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
          <p className="text-white/60 text-sm font-medium">Leave a Review</p>
          <StarRating value={rating} onChange={setRating} />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Share your experience with this protocol... (optional)"
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#4fffb0]/50 resize-none transition-colors"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="self-end px-4 py-1.5 rounded-lg text-sm font-medium bg-[#4fffb0] text-[#0a1628] hover:bg-[#4fffb0]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      ) : (
        <p className="text-white/40 text-sm">
          <a href="/auth/login" className="text-[#4fffb0] hover:underline">Log in</a> to leave a review.
        </p>
      )}

      {/* review list */}
      <div className="flex flex-col gap-3">
        {reviews.length === 0 ? (
          <p className="text-white/30 text-sm">No reviews yet. Be the first!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={review.user?.name ?? 'Unknown'} size="sm" />
                  <span className="text-white/60 text-xs font-medium">{review.user?.name}</span>
                  <span className="text-white/30 text-xs">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </span>
                </div>
                <StarRating value={review.rating} readonly size="sm" />
              </div>
              {review.body && (
                <p className="text-white/60 text-sm leading-relaxed">{review.body}</p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}