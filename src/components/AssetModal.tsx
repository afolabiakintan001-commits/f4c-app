'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

interface AssetModalProps {
  asset: Asset | null;
  onClose: () => void;
}

export default function AssetModal({ asset, onClose }: AssetModalProps) {
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (!asset) return;

    // Check if asset is fully free
    if (asset.access_type === 'FULLY_FREE') {
      setUnlocked(true);
    }

    // Fetch logged in user points
    async function fetchUserPoints() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('points_balance')
          .eq('id', user.id)
          .single();
        if (data) setUserPoints(data.points_balance);
      }
    }

    fetchUserPoints();
  }, [asset]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (asset) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [asset]);

  if (!asset) return null;

  const handleRedeem = async () => {
    setDownloading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to redeem assets.');
      setDownloading(false);
      return;
    }

    // Deduct 50 points for standard FREE tier
    const pointCost = 50;

    if ((userPoints || 0) < pointCost) {
      alert('Insufficient points balance.');
      setDownloading(false);
      return;
    }

    const newBalance = (userPoints || 0) - pointCost;

    const { error } = await supabase
      .from('profiles')
      .update({ points_balance: newBalance })
      .eq('id', user.id);

    if (error) {
      alert('Failed to process redemption.');
    } else {
      setUserPoints(newBalance);
      setUnlocked(true);
    }

    setDownloading(false);
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(10, 10, 10, 0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="mono"
        style={{
          background: '#fff', border: '1px solid #dcdcd7',
          maxWidth: '800px', width: '100%', padding: '24px',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px'
        }}
      >
        {/* Preview Frame */}
        <div style={{ background: '#f1f1ef', border: '1px solid #dcdcd7', aspectRatio: '4/5', overflow: 'hidden' }}>
          <img src={asset.preview_url} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Metadata & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#71716b' }}>[ ASSET INSPECTOR ]</span>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <h2 style={{ fontSize: '20px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, marginBottom: '8px' }}>
              {asset.title}
            </h2>

            <div style={{ fontSize: '13px', marginBottom: '20px', color: '#71716b' }}>
              creator: <span style={{ color: '#0a0a0a', fontWeight: 600 }}>@{asset.profiles?.username || 'verified_creator'}</span>
            </div>

            <div style={{ borderTop: '1px solid #dcdcd7', borderBottom: '1px solid #dcdcd7', padding: '12px 0', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#71716b' }}>RESOLUTION</span>
                <span style={{ fontWeight: 600 }}>{asset.resolution}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#71716b' }}>ACCESS TIER</span>
                <span style={{ fontWeight: 600 }}>{asset.access_type}</span>
              </div>
              {userPoints !== null && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#71716b' }}>YOUR BALANCE</span>
                  <span style={{ fontWeight: 600 }}>{userPoints} PTS</span>
                </div>
              )}
            </div>
          </div>

          {/* Download / Unlock CTA */}
          <div>
            {unlocked ? (
              <a
                href={asset.master_file_url}
                target="_blank"
                rel="noreferrer"
                download
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: '#0a0a0a', color: '#fff', padding: '14px',
                  textDecoration: 'none', fontSize: '13px', fontWeight: 500
                }}
              >
                [ DOWNLOAD MASTER FILE ]
              </a>
            ) : asset.access_type === 'MONEY' ? (
              <a
                href={`/checkout?asset_id=${asset.id}`}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  background: '#0a0a0a', color: '#fff', padding: '14px',
                  textDecoration: 'none', fontSize: '13px', fontWeight: 500
                }}
              >
                [ PURCHASE UNCOMPRESSED — £{asset.price_gbp} ]
              </a>
            ) : (
              <button
                onClick={handleRedeem}
                disabled={downloading}
                style={{
                  width: '100%', background: '#0a0a0a', color: '#fff',
                  padding: '14px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 500
                }}
              >
                {downloading ? '[ DEDUCTING POINTS... ]' : '[ REDEEM — 50 POINTS ]'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
