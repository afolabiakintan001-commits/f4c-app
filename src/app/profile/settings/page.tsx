'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface ProfileData {
  primary_handle: string
  display_name: string
  bio: string
  instagram_handle: string
  tiktok_handle: string
  youtube_handle: string
  x_handle: string
  portfolio_url: string
  is_verified: boolean
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ProfileData>({
    primary_handle: '',
    display_name: '',
    bio: '',
    instagram_handle: '',
    tiktok_handle: '',
    youtube_handle: '',
    x_handle: '',
    portfolio_url: '',
    is_verified: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) setProfile(data)
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMsg(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Formatting handles to ensure '@' consistency
    const formattedData = {
      ...profile,
      primary_handle: profile.primary_handle.startsWith('@') 
        ? profile.primary_handle 
        : `@${profile.primary_handle}`,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      .update(formattedData)
      .eq('id', user.id)

    setSaving(false)
    if (error) {
      setStatusMsg(`[ SAVE_FAILED ]: ${error.message}`)
    } else {
      setStatusMsg('[ PROFILE_UPDATED ]: Vault profile and cross-platform handles synced.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 font-mono text-xs">
        [ INITIALIZING_VAULT_SETTINGS... ]
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 font-mono">
      {/* Header */}
      <div className="border-b border-[#0a0a0a] pb-4 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">
            [ VAULT_CREATOR_SETTINGS ]
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure your universal creator ledger handles and portfolio identity.
          </p>
        </div>
        {profile.is_verified && (
          <span className="px-2 py-1 bg-[#0a0a0a] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
            .sq-verified
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Identity */}
        <div className="border border-[#dcdcd7] p-5 bg-white shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase border-b border-[#dcdcd7] pb-2 text-gray-800">
            [ PRIMARY_IDENTITY ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">
                F4C Primary Handle
              </label>
              <input
                type="text"
                value={profile.primary_handle}
                onChange={(e) => setProfile({ ...profile, primary_handle: e.target.value })}
                className="w-full px-3 py-2 border border-[#0a0a0a] text-xs font-mono bg-gray-50"
                placeholder="@handle"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={profile.display_name}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full px-3 py-2 border border-[#0a0a0a] text-xs font-mono bg-gray-50"
                placeholder="Rin Visuals"
              />
            </div>
          </div>
        </div>

        {/* Universal Social Platform Handles */}
        <div className="border border-[#dcdcd7] p-5 bg-white shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase border-b border-[#dcdcd7] pb-2 text-gray-800">
            [ CROSS_PLATFORM_LEDGER_HANDLES ]
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 text-gray-600">
                Instagram Handle
              </label>
              <input
                type="text"
                value={profile.instagram_handle || ''}
                onChange={(e) => setProfile({ ...profile, instagram_handle: e.target.value })}
                className="w-full px-3 py-2 border border-[#dcdcd7] text-xs font-mono focus:border-[#0a0a0a] outline-none"
                placeholder="@rin.edits"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 text-gray-600">
                TikTok Handle
              </label>
              <input
                type="text"
                value={profile.tiktok_handle || ''}
                onChange={(e) => setProfile({ ...profile, tiktok_handle: e.target.value })}
                className="w-full px-3 py-2 border border-[#dcdcd7] text-xs font-mono focus:border-[#0a0a0a] outline-none"
                placeholder="@rin_edits"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 text-gray-600">
                YouTube Channel
              </label>
              <input
                type="text"
                value={profile.youtube_handle || ''}
                onChange={(e) => setProfile({ ...profile, youtube_handle: e.target.value })}
                className="w-full px-3 py-2 border border-[#dcdcd7] text-xs font-mono focus:border-[#0a0a0a] outline-none"
                placeholder="@RinMotionGraphics"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase mb-1 text-gray-600">
                X / Twitter Handle
              </label>
              <input
                type="text"
                value={profile.x_handle || ''}
                onChange={(e) => setProfile({ ...profile, x_handle: e.target.value })}
                className="w-full px-3 py-2 border border-[#dcdcd7] text-xs font-mono focus:border-[#0a0a0a] outline-none"
                placeholder="@rin_vfx"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase mb-1 text-gray-600">
              External Portfolio / Website
            </label>
            <input
              type="url"
              value={profile.portfolio_url || ''}
              onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
              className="w-full px-3 py-2 border border-[#dcdcd7] text-xs font-mono focus:border-[#0a0a0a] outline-none"
              placeholder="https://rinvisuals.com"
            />
          </div>
        </div>

        {/* Save Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#0a0a0a] text-white font-mono text-xs uppercase font-bold tracking-wider hover:bg-black transition-colors"
          >
            {saving ? '[ SAVING_LEDGER... ]' : '[ SAVE_SETTINGS ]'}
          </button>

          {statusMsg && (
            <p className="text-xs font-mono text-gray-700 bg-gray-100 px-3 py-2 border border-[#0a0a0a]">
              {statusMsg}
            </p>
          )}
        </div>

      </form>
    </div>
  )
}
