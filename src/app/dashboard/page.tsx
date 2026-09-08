'use client'

import React, { useState, useEffect } from 'react'
import ImageGrid from '@/components/ImageGrid'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client'

export default function DashboardPage() {
  const { profile, user } = useAuth()
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts'>('all')
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadAssets() {
      if (!user) return
      setLoading(true)
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAssets(data)
      }
      setLoading(false)
    }

    loadAssets()
  }, [user])

  const filteredAssets = assets.filter((asset) => {
    if (activeTab === 'published') return asset.status === 'published'
    if (activeTab === 'drafts') return asset.status === 'draft'
    return true
  })

  return (
    <div className="min-h-screen w-full flex flex-col font-sans text-[#0a0a0a]">
      {/* Navigation Header */}
      <header className="w-full border-b border-[#dcdcd7] bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-[7px] h-[7px] bg-[#0a0a0a] inline-block" />
          <span className="font-mono font-bold tracking-tight text-sm uppercase">F4C</span>
          <span className="text-[#71716b] font-mono text-xs">/</span>
          <span className="font-mono text-xs text-[#71716b]">dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-xs border border-[#dcdcd7] px-2.5 py-1 rounded-[2px] bg-[#f6f6f4]">
            [ pts: <span className="font-semibold text-[#0a0a0a]">{profile?.points ?? 500}</span> ]
          </div>
          <Link
            href="/submit"
            className="font-mono text-xs bg-[#0a0a0a] text-white px-3.5 py-1.5 rounded-[2px] hover:bg-[#71716b] transition-colors"
          >
            [ + upload_new_asset ]
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-8 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#dcdcd7] pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0a0a0a]">
              Dashboard
            </h1>
            <p className="text-sm text-[#71716b] mt-1 font-sans">
              Manage your master files and track earnings.
            </p>
          </div>
          <div className="font-mono text-xs text-[#71716b]">
            user: <span className="text-[#0a0a0a]">{profile?.username || user?.email?.split('@')[0]}</span>
          </div>
        </div>

        {/* Ledger Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-[#dcdcd7] bg-white p-5 rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-xs text-[#71716b] uppercase tracking-wider">[ assets ]</span>
            <div className="text-3xl font-mono font-medium mt-3 text-[#0a0a0a]">{assets.length}</div>
          </div>
          <div className="border border-[#dcdcd7] bg-white p-5 rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-xs text-[#71716b] uppercase tracking-wider">[ lifetime_earnings ]</span>
            <div className="text-3xl font-mono font-medium mt-3 text-[#0a0a0a]">$0.00</div>
          </div>
          <div className="border border-[#dcdcd7] bg-white p-5 rounded-[2px] flex flex-col justify-between">
            <span className="font-mono text-xs text-[#71716b] uppercase tracking-wider">[ balance ]</span>
            <div className="text-3xl font-mono font-medium mt-3 text-[#0a0a0a]">{profile?.points ?? 500} pts</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-6 border-b border-[#dcdcd7] pt-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 font-mono text-xs transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'all'
                ? 'border-[#0a0a0a] text-[#0a0a0a] font-medium'
                : 'border-transparent text-[#71716b] hover:text-[#0a0a0a]'
            }`}
          >
            <span>all_assets</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#f6f6f4] border border-[#dcdcd7] rounded-[2px]">
              {assets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('published')}
            className={`pb-3 font-mono text-xs transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'published'
                ? 'border-[#0a0a0a] text-[#0a0a0a] font-medium'
                : 'border-transparent text-[#71716b] hover:text-[#0a0a0a]'
            }`}
          >
            <span>published</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#f6f6f4] border border-[#dcdcd7] rounded-[2px]">
              {assets.filter((a) => a.status === 'published').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-3 font-mono text-xs transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === 'drafts'
                ? 'border-[#0a0a0a] text-[#0a0a0a] font-medium'
                : 'border-transparent text-[#71716b] hover:text-[#0a0a0a]'
            }`}
          >
            <span>drafts</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-[#f6f6f4] border border-[#dcdcd7] rounded-[2px]">
              {assets.filter((a) => a.status === 'draft').length}
            </span>
          </button>
        </div>

        {/* Contact Sheet Asset Grid */}
        {loading ? (
          <div className="py-20 text-center font-mono text-xs text-[#71716b] border border-dashed border-[#dcdcd7] bg-white rounded-[2px]">
            [ loading_assets... ]
          </div>
        ) : (
          <ImageGrid assets={filteredAssets} username={profile?.username || 'user'} />
        )}
      </main>
    </div>
  )
}
