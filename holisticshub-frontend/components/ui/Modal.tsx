'use client'

import { useEffect } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* panel */}
      <div
        className="relative z-10 w-full max-w-lg rounded-xl border border-white/12 bg-[#0a1628] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  )
}