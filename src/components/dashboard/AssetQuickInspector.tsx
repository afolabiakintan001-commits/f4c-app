'use client';

import { useState, useEffect } from 'react';
import '../../app/globals.css';

interface Asset {
  id: string;
  title: string;
  preview_url: string;
  master_file_url: string;
  resolution: string;
  access_type: 'FREE' | 'FULLY_FREE' | 'MONEY';
  price_gbp?: number;
  profiles: {
    username: string;
    is_verified: boolean;
  };
}

interface AssetQuickInspectorProps {
  asset: Asset | null;
  onClose: () => void;
  isMobile: boolean;
}

export default function AssetQuickInspector({ asset, onClose, isMobile }: AssetQuickInspectorProps) {
  const [isOpen, setIsOpen] = useState(!!asset);

  useEffect(() => {
    setIsOpen(!!asset);
  }, [asset]);

  if (!asset || !isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 150);
  };

  // MOBILE: Bottom sheet
  if (isMobile) {
    return (
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(10, 10, 10, 0.4)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid var(--border)',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderTopLeftRadius: 'var(--radius)',
            borderTopRightRadius: 'var(--radius)',
            padding: '20px',
            maxHeight: '80vh',
            overflow: 'auto',
            animation: 'slideUp 0.2s ease',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'var(--muted)',
              }}
            >
              ✕
            </button>
          </div>

          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>{asset.title}</h2>
          
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }} className="mono">
            @{asset.profiles?.username || 'creator'} {asset.profiles?.is_verified && <span className="sq-verified" />}
          </div>

          <div style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: 'var(--radius)', marginBottom: '20px' }} className="mono">
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>resolution: {asset.resolution}</div>
            <div style={{ fontSize: '12px', marginBottom: '8px' }}>access_type: {asset.access_type}</div>
            {asset.price_gbp && <div style={{ fontSize: '12px' }}>price: £{asset.price_gbp}</div>}
          </div>

          <a href={asset.master_file_url} download className="btn-solid" style={{ width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
            [ download_master ]
          </a>
        </div>
      </div>
    );
  }

  // DESKTOP: Slide-over drawer (right side)
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-380px',
        width: '380px',
        height: '100vh',
        background: '#fff',
        border: '1px solid var(--border)',
        zIndex: 50,
        transition: 'right 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        overflow: 'auto',
        boxShadow: isOpen ? '0 0 0 1px rgba(10, 10, 10, 0.1)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>
          [ asset_inspector ]
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: 'var(--muted)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          ✕
        </button>
      </div>

      <img
        src={asset.preview_url}
        alt={asset.title}
        style={{
          width: '100%',
          aspectRatio: '4/5',
          objectFit: 'cover',
          borderRadius: 'var(--radius)',
          marginBottom: '20px',
          border: '1px solid var(--border)',
        }}
      />

      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{asset.title}</h2>

      <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }} className="mono">
        @{asset.profiles?.username || 'creator'} {asset.profiles?.is_verified && <span className="sq-verified" />}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 0',
          marginBottom: '20px',
        }}
        className="mono"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px', color: 'var(--muted)' }}>
          <span>resolution</span>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{asset.resolution}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px', color: 'var(--muted)' }}>
          <span>access_tier</span>
          <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{asset.access_type}</span>
        </div>
        {asset.price_gbp && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)' }}>
            <span>price</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>£{asset.price_gbp}</span>
          </div>
        )}
      </div>

      <a href={asset.master_file_url} download className="btn-solid" style={{ width: '100%', textAlign: 'center', marginTop: 'auto', textDecoration: 'none', display: 'block' }}>
        [ download_master ]
      </a>
    </div>
  );
}
