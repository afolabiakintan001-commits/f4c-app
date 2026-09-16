'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { LinkedHandles } from '@/components/profile/LinkedHandles'

interface ProfileData {
  primary_handle: string
  display_name: string
  bio: string
  portfolio_url: string
  is_verified: boolean
}

interface Handle {
  id: string
  creator_id: string
  platform: 'TikTok' | 'Instagram' | 'X' | 'YouTube'
  handle: string
  verified: boolean
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ProfileData>({
    primary_handle: '',
    display_name: '',
    bio: '',
    portfolio_url: '',
    is_verified: false,
  })
  const [handles, setHandles] = useState<Handle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const supabase = createBrowserClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Load profile
        const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (p) setProfile(p)
        
        // Load handles
        const { data: h } = await supabase.from('linked_handles').select('*').eq('creator_id', user.id)
        if (h) setHandles(h)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleUpdateHandle = (id: string, field: keyof Handle, value: any) => {
    setHandles(handles.map(h => h.id === id ? { ...h, [field]: value } : h))
  }

  const handleAddHandle = () => {
    setHandles([...handles, { id: crypto.randomUUID(), creator_id: '', platform: 'TikTok', handle: '', verified: false }])
  }

  const handleRemoveHandle = (id: string) => {
    setHandles(handles.filter(h => h.id !== id))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMsg(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Save Profile
    await supabase.from('profiles').update(profile).eq('id', user.id)
    
    // Save Handles (delete/upsert strategy)
    await supabase.from('linked_handles').delete().eq('creator_id', user.id)
    if (handles.length > 0) {
        await supabase.from('linked_handles').insert(handles.map(h => ({ ...h, id: undefined, creator_id: user.id })))
    }

    setSaving(false)
    setStatusMsg('[ PROFILE_UPDATED ]')
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 font-mono text-xs">
        [ INITIALIZING_VAULT_SETTINGS... ]
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 font-mono">
      {/* Header */}
      <div className="border-b border-[#0a0a0a] pb-4 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight">Account settings</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure your universal creator ledger handles and portfolio identity.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-mono border border-black px-1">[ VAULT_CREATOR_SETTINGS ]</span>
            {profile.is_verified && (
            <span className="px-2 py-1 bg-[#0a0a0a] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                .sq-verified
            </span>
            )}
        </div>
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
                value={profile.primary_handle || ''}
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
                value={profile.display_name || ''}
                onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                className="w-full px-3 py-2 border border-[#0a0a0a] text-xs font-mono bg-gray-50"
                placeholder="Rin Visuals"
              />
            </div>
          </div>
        </div>

        {/* Linked Handles */}
        <LinkedHandles 
          handles={handles} 
          onAdd={handleAddHandle} 
          onRemove={handleRemoveHandle} 
          onUpdate={handleUpdateHandle} 
        />

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
