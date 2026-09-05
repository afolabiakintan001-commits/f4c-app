'use client'

import React, { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1. Google OAuth Handshake
  const handleGoogleLogin = async () => {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setMessage(`[ ERROR ]: ${error.message}`)
      setLoading(false)
    }
  }

  // 2. Passwordless Magic Link Sign In
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)
    if (error) {
      setMessage(`[ ERROR ]: ${error.message}`)
    } else {
      setMessage('[ SUCCESS ]: Magic link dispatched. Check your inbox.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border border-[#0a0a0a] p-6 shadow-[4px_4px_0px_0px_#0a0a0a] font-mono">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#dcdcd7] pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#0a0a0a] inline-block"></span>
            <h2 className="text-sm font-bold tracking-tight uppercase">
              [ CREATOR_AUTHENTICATION ]
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-xs hover:bg-[#0a0a0a] hover:text-white px-2 py-1 border border-[#dcdcd7] transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-6 font-mono leading-relaxed">
          Access your high-fidelity vault. Claim your primary handle and publish uncompressed master assets across Instagram, TikTok, YouTube, and X.
        </p>

        {/* Option A: Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-4 py-3 px-4 border border-[#0a0a0a] bg-white hover:bg-[#0a0a0a] hover:text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-3 group"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.24 10.285V13.4h6.887C18.2 15.68 15.8 18 12.24 18c-3.535 0-6.4-2.865-6.4-6.4s2.865-6.4 6.4-6.4c1.58 0 3.02.58 4.14 1.54l2.42-2.42C17.34 2.8 14.94 2 12.24 2 6.58 2 2 6.58 2 12.24s4.58 10.24 10.24 10.24c5.92 0 9.84-4.16 9.84-10.02 0-.68-.08-1.36-.2-2.175H12.24z"/>
          </svg>
          [ CONTINUE_WITH_GOOGLE ]
        </button>

        {/* Divider */}
        <div className="relative flex py-3 items-center mb-4">
          <div className="flex-grow border-t border-[#dcdcd7]"></div>
          <span className="flex-shrink mx-3 text-[10px] text-gray-400 uppercase font-mono">
            OR_PASSWORDLESS_EMAIL
          </span>
          <div className="flex-grow border-t border-[#dcdcd7]"></div>
        </div>

        {/* Option B: Magic Link Form */}
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider mb-1 text-gray-700">
              [ CREATOR_EMAIL_ADDRESS ]
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@domain.com"
              required
              className="w-full px-3 py-2 border border-[#0a0a0a] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] bg-gray-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#0a0a0a] text-white hover:bg-black font-mono text-xs uppercase font-bold tracking-wider transition-all disabled:opacity-50"
          >
            {loading ? '[ DISPATCHING... ]' : '[ SEND_MAGIC_LINK ]'}
          </button>
        </form>

        {/* Message Feedback */}
        {message && (
          <div className="mt-4 p-2 border border-[#0a0a0a] bg-gray-50 text-[11px] font-mono text-center">
            {message}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#dcdcd7] text-[10px] text-gray-400 text-center font-mono">
          f4creators ledger system v1.0 • zero-compression vault
        </div>

      </div>
    </div>
  )
}
