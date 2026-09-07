'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setMessage(`[ ERROR ]: ${error.message}`)
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setMessage(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    setLoading(false)
    if (error) setMessage(`[ ERROR ]: ${error.message}`)
    else setMessage('[ SUCCESS ]: Magic link dispatched. Check your inbox.')
  }

  return (
    <div className="login-page-wrapper">
      <div className="auth-card">
        
        {/* Header Row: F4C Logo Mark */}
        <div className="flex items-center gap-2 font-mono font-bold text-[16px]">
          <span className="w-[7px] h-[7px] bg-[#0a0a0a] inline-block"></span>
          <span>F4C</span>
        </div>

        {/* Title */}
        <h1 className="font-mono font-bold uppercase tracking-tight"
            style={{ fontSize: '22px', whiteSpace: 'nowrap' }}>
          [ creator_authentication ]
        </h1>

        {/* Subhead */}
        <p className="font-['Space_Grotesk'] text-[14px] text-[#71716b] leading-normal">
          Claim your handle and publish uncompressed master files across Instagram, TikTok, YouTube, X.
        </p>

        <div className="flex flex-col gap-[18px]">
          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 border border-[#dcdcd7] bg-white font-mono text-[13px] uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-3 cursor-pointer hover:bg-[#f1f1ef]"
            style={{ borderRadius: '2px' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M12.24 10.285V13.4h6.887C18.2 15.68 15.8 18 12.24 18c-3.535 0-6.4-2.865-6.4-6.4s2.865-6.4 6.4-6.4c1.58 0 3.02.58 4.14 1.54l2.42-2.42C17.34 2.8 14.94 2 12.24 2 6.58 2 2 6.58 2 12.24s4.58 10.24 10.24 10.24c5.92 0 9.84-4.16 9.84-10.02 0-.68-.08-1.36-.2-2.175H12.24z" fill="#0A0A0A"/></svg>
            [ continue_with_google ]
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 font-mono text-[11px] text-[#71716b] uppercase tracking-widest">
            <div className="flex-grow border-t border-[#dcdcd7]"></div>
            or magic link
            <div className="flex-grow border-t border-[#dcdcd7]"></div>
          </div>

          {/* Magic Link Form */}
          <form onSubmit={handleMagicLink} className="space-y-[18px]">
            <div>
              <label className="block mb-2 font-mono text-[11px] uppercase font-bold tracking-widest text-[#0a0a0a]">
                [ email_address ]
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@domain.com"
                required
                className="w-full pb-3 border-b border-[#dcdcd7] font-mono text-[14px] focus:outline-none focus:border-[#0a0a0a] bg-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#0a0a0a] text-white font-mono text-[13px] uppercase font-bold tracking-wider disabled:opacity-50 cursor-pointer"
              style={{ borderRadius: '2px' }}
            >
              {loading ? '[ dispatching... ]' : '[ send_magic_link ]'}
            </button>
          </form>

          {/* Feedback Message */}
          {message && (
            <div className="font-mono text-[12px] text-[#0a0a0a] border-t border-[#dcdcd7] pt-6">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
