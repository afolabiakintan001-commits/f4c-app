'use client';

import { useState, useEffect } from 'react';
import '../app/globals.css';

interface Asset {
  id: string;
  title: string;
  preview_url: string;
  resolution: string;
  access_type: 'FREE' | 'FULLY_FREE' | 'MONEY';
  price_gbp?: number;
  profiles: {
    username: string;
    is_verified: boolean;
  };
}

interface ImageGridProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
  loading?: boolean;
}

export default function ImageGrid({ assets, onAssetSelect, loading = false }: ImageGridProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }} className="mono">
        [ querying live database... ]
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div
        style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}
        className="mono"
      >
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
          [ INDEX EMPTY — NO PUBLISHED ASSETS YET ]
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
          Be the first verified creator to host uncompressed assets on F4C.
        </div>
      </div>
    );
  }

  // DESKTOP: 4-5 column fixed-ratio contact-sheet grid
  if (!isMobile) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px',
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
        }}
      >
        {assets.map((asset, idx) => {
          const code = 'F' + String(idx + 1).padStart(3, '0');
          const tierBadge =
            asset.access_type === 'MONEY'
              ? `£${asset.price_gbp}`
              : asset.access_type === 'FULLY_FREE'
              ? 'FULLY FREE'
              : 'FREE';

          return (
            <div
              key={asset.id}
              onClick={() => onAssetSelect(asset)}
              style={{
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--ink)';
                e.currentTarget.style.zIndex = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.zIndex = '0';
              }}
            >
              {/* IMAGE FRAME */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4/5',
                  overflow: 'hidden',
                  background: '#f1f1ef',
                }}
              >
                <img
                  src={asset.preview_url}
                  alt={asset.title || 'Asset'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  loading="lazy"
                />
                {/* FRAME CODE TAG */}
                <span
                  className="mono"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '10.5px',
                    color: '#fff',
                    background: 'rgba(10,10,10,0.6)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius)',
                    letterSpacing: '0.02em',
                  }}
                >
                  [{code}]
                </span>
                {/* TIER BADGE */}
                <span
                  className="mono"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    background: 'rgba(255,255,255,0.92)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius)',
                  }}
                >
                  {tierBadge}
                </span>
              </div>

              {/* CAPTION BAR */}
              <div
                style={{
                  padding: '8px 10px',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    @{asset.profiles?.username || 'creator'}
                  </span>
                  {asset.profiles?.is_verified && <span className="sq-verified"></span>}
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: '10px',
                    color: 'var(--muted)',
                    flexShrink: 0,
                  }}
                >
                  {asset.resolution}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // MOBILE: 1-2 column stacked ledger card list
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
      {assets.map((asset, idx) => {
        const code = 'F' + String(idx + 1).padStart(3, '0');
        const tierBadge =
          asset.access_type === 'MONEY'
            ? `£${asset.price_gbp}`
            : asset.access_type === 'FULLY_FREE'
            ? 'FULLY FREE'
            : 'FREE';

        return (
          <div
            key={asset.id}
            onClick={() => onAssetSelect(asset)}
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: '#f1f1ef',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'border-color 0.15s ease',
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.borderColor = 'var(--ink)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <img
              src={asset.preview_url}
              alt={asset.title || 'Asset'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              loading="lazy"
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(10, 10, 10, 0.6)',
                color: '#fff',
                padding: '4px 6px',
                fontSize: '9px',
              }}
              className="mono"
            >
              [{code}]
            </div>
          </div>
        );
      })}
    </div>
  );
}
