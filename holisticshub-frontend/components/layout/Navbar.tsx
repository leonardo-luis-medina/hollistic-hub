'use client'

import Link from 'next/link'
import { useAuthStore } from '@/lib/auth'
import SearchBar from '@/components/search/SearchBar'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuthStore()
  

  function handleLogout() {
    logout()
    toast.success('Logged out successfully')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#2d5a27]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* logo */}
        <Link href="/" className="shrink-0 font-bold text-lg text-[#4fffb0]">
          🌿 HolisticsHub
        </Link>

        {/* search */}
        <div className="flex-1">
          <SearchBar />
        </div>

        {/* nav links */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link
            href="/protocols"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Protocols
          </Link>
          <Link
            href="/threads"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Threads
          </Link>
        </div>

        

        {/* auth */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <>
              <span className="text-white/50 text-sm hidden md:block">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-3 py-1.5 rounded-lg text-sm text-white/60 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#4fffb0] text-[#0a1628] hover:bg-[#4fffb0]/90 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}