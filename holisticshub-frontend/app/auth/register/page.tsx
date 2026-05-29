'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/lib/auth'
import { toast } from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [name, setName]                   = useState('')
  const [email, setEmail]                 = useState('')
  const [password, setPassword]           = useState('')
  const [confirmation, setConfirmation]   = useState('')
  const [error, setError]                 = useState('')
  const [isLoading, setIsLoading]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmation) {
      setError('Passwords do not match.')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      const res = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: confirmation,
      })
      login(res.data.user, res.data.token)
        toast.success('Account created! Welcome to HolisticsHub!')
        router.push('/')
    } catch (err: any) {
      const messages = err.response?.data?.errors
      if (messages) {
        const first = Object.values(messages)[0] as string[]
        setError(first[0])
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* card */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 flex flex-col gap-6">

          {/* header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00d4ff]">
              Create Account
            </h1>
            <p className="text-white/40 text-sm mt-1">Join the HolisticsHub community</p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#4fffb0]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#4fffb0]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#4fffb0]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-white/60 text-sm">Confirm Password</label>
              <input
                type="password"
                value={confirmation}
                onChange={e => setConfirmation(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#4fffb0]/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg font-medium bg-[#4fffb0] text-[#0a1628] hover:bg-[#4fffb0]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* footer */}
          <p className="text-center text-white/40 text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#4fffb0] hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}