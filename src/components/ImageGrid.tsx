'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Asset {
  id: string
  title?: string
  url: string
  resolution?: string
  file_size?: string
  tier?: string
  created_at?: string
  status?: string
}

interface ImageGridProps {
  assets?: Asset[]
  username?: string
}

export default function ImageGrid({ assets = [], username = 'creator' }: ImageGridProps) {
  if (!assets || assets.length === 0) {
    return (
      <div className="py-20 text-center bg-white border border-dashed border-[#dcdcd7] rounded-[2px]">
        <p className="font-mono text-xs text-[#71716b] mb-4">[ no_assets_found_in_vault ]</p>
        <p className="font-sans text-sm text-[#71716b] mb-6">
          You haven't uploaded any uncompressed master files to this directory yet.
        </p>
        <Link
          href="/submit"
          className="inline-block font-mono text-xs bg-[#0a0a0a] text-white px-4 py-2 rounded-[2px] hover:bg-[#71716b] transition-colors"
        >
          [ + upload_first_master ]
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {assets.map((asset, index) => {
        const frameIndex = `F${(index + 1).toString().padStart(3, '0')}`
        return (
          <div
            key={asset.id}
            className="group border border-[#dcdcd7] bg-white rounded-[2px] flex flex-col overflow-hidden hover:border-[#0a0a0a] transition-colors"
          >
            {/* Fixed Aspect Square Contact-Sheet Tile */}
            <div className="relative aspect-square w-full bg-[#f6f6f4] overflow-hidden border-b border-[#dcdcd7]">
              {/* Frame Index Tag */}
              <div className="absolute top-2 left-2 z-10 font-mono text-[10px] bg-white border border-[#dcdcd7] px-1.5 py-0.5 rounded-[2px] text-[#0a0a0a]">
                [{frameIndex}]
              </div>

              <Image
                src={asset.url}
                alt={asset.title || 'Master Asset'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>

            {/* Permanent Caption Bar */}
            <div className="p-3.5 flex flex-col gap-2 bg-white">
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans font-medium text-sm text-[#0a0a0a] truncate">
                  {asset.title || 'Untitled Master'}
                </span>
                <span className="font-mono text-[10px] uppercase text-[#71716b] border border-[#dcdcd7] px-1 py-0.2 rounded-[2px]">
                  {asset.tier || 'RAW'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#71716b] border-t border-[#f6f6f4] pt-2">
                <div className="flex items-center gap-1">
                  <span className="w-[5px] h-[5px] bg-[#0a0a0a] inline-block" />
                  <span>@{username}</span>
                </div>
                <span>{asset.resolution || '4K · MASTER'}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
