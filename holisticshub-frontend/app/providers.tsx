'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { initAuth } from '@/lib/auth'
import { Toaster } from 'react-hot-toast'

function AuthInit({ children }: { children: React.ReactNode }) {
  useEffect(() => { initAuth() }, [])
  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInit>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0a1628',
              color: '#f0f4ff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            success: {
              iconTheme: {
                primary: '#4fffb0',
                secondary: '#0a1628',
              },
            },
          }}
        />
      </AuthInit>
    </QueryClientProvider>
  )
}