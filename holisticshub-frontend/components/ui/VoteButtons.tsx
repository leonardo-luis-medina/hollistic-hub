'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth'
import api from '@/lib/api'
import toast from 'react-hot-toast'

type VoteButtonsProps = {
  votableType: 'App\\Models\\Thread' | 'App\\Models\\Comment'
  votableId: number
  initialUpvotes: number
  initialDownvotes: number
  userVote?: 'up' | 'down' | null
}

export default function VoteButtons({
  votableType,
  votableId,
  initialUpvotes,
  initialDownvotes,
  userVote: initialUserVote = null,
}: VoteButtonsProps) {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()

  const [upvotes, setUpvotes]     = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [userVote, setUserVote]   = useState(initialUserVote)

  async function handleVote(type: 'up' | 'down') {
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    const prevVote      = userVote
    const prevUpvotes   = upvotes
    const prevDownvotes = downvotes

    // same button = unvote
    if (userVote === type) {
      setUserVote(null)
      type === 'up' ? setUpvotes(u => u - 1) : setDownvotes(d => d - 1)
      try {
        await api.delete('/votes', {
          data: { votable_id: votableId, votable_type: votableType }
        })
        toast.success('Vote removed')
      } catch {
        setUserVote(prevVote)
        setUpvotes(prevUpvotes)
        setDownvotes(prevDownvotes)
        toast.error('Failed to remove vote')
      }
      return
    }

    // switching vote
    if (userVote !== null) {
      userVote === 'up' ? setUpvotes(u => u - 1) : setDownvotes(d => d - 1)
    }
    type === 'up' ? setUpvotes(u => u + 1) : setDownvotes(d => d + 1)
    setUserVote(type)

    try {
      await api.post('/votes', {
        votable_id: votableId,
        votable_type: votableType,
        type,
      })
      toast.success(type === 'up' ? 'Upvoted!' : 'Downvoted!')
    } catch {
      setUserVote(prevVote)
      setUpvotes(prevUpvotes)
      setDownvotes(prevDownvotes)
      toast.error('Failed to vote')
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote('up') }}
        className={`
          flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium
          border transition-all
          ${userVote === 'up'
            ? 'bg-[#4fffb0]/20 border-[#4fffb0]/50 text-[#4fffb0]'
            : 'bg-white/5 border-white/10 text-white/50 hover:text-[#4fffb0] hover:border-[#4fffb0]/30'}
        `}
      >
        ▲ {upvotes}
      </button>

      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote('down') }}
        className={`
          flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium
          border transition-all
          ${userVote === 'down'
            ? 'bg-red-500/20 border-red-500/50 text-red-400'
            : 'bg-white/5 border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/30'}
        `}
      >
        ▼ {downvotes}
      </button>
    </div>
  )
}