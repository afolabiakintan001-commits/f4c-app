'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import StorageWidget from '@/components/dashboard/StorageWidget';
import AssetQuickInspector from '@/components/dashboard/AssetQuickInspector';
import PointsAuditLog from '@/components/dashboard/PointsAuditLog';
import AssetVisibilityToggles from '@/components/dashboard/AssetVisibilityToggles';
import DeliveryTelemetry from '@/components/dashboard/DeliveryTelemetry';
import '../globals.css';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [isCreator, setIsCreator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showInspector, setShowInspector] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  useEffect(() => {
    // TODO: Check if user is verified creator from Supabase
    // Query: SELECT is_verified FROM profiles WHERE id = user.id
    setIsCreator(false);
  }, [user]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="mono" style={{ fontSize: '13px', color: 'var(--muted)' }}>
          [ loading vault... ]
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{ maxWidth: '440px', textAlign: 'center' }}>
          <p>You need to be logged in to access your dashboard.</p>
          <a href="/login" className="btn-solid" style={{ display: 'inline-block', marginTop: '16px' }}>
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <header
        style={{
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(8px)',
          zIndex: 10,
        }}
      >
        {!isCreator && (
          <a href="/onboarding" style={{ display: 'block', background: 'var(--ink)', color: '#fff', textAlign: 'center', padding: '6px', fontSize: '11px', textDecoration: 'none' }} className="mono">
            [ UNLOCK_PUBLISHING · CLAIM_CREATOR_HANDLE ]
          </a>
        )}
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '19px', flex: '0 0 auto' }}>
            <span className="sq"></span>F4C
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }} className="mono">
              Dashboard — {profile?.username || 'User'}
            </div>
          </div>

          {!isCreator && (
            <div className="mono" style={{ fontSize: '11px', padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--muted)', whiteSpace: 'nowrap', flex: '0 0 auto' }}>
              [ upgrade_to_creator ]
            </div>
          )}

          <a href="/" className="mono" style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', cursor: 'pointer', flex: '0 0 auto' }}>
            [ logout ]
          </a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="wrap" style={{ padding: '40px 32px' }}>
        {isCreator ? (
          <div style={{ display: 'grid', gap: '32px' }}>
            {/* CREATOR DASHBOARD: 3-column top row */}
            <div style={{ display: isMobile ? 'grid' : 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
              <StorageWidget />
              <PointsAuditLog />
              <DeliveryTelemetry />
            </div>

            {/* CREATOR DASHBOARD: Asset management */}
            <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '24px' }}>
              <AssetVisibilityToggles
                onAssetSelect={(asset) => {
                  setSelectedAsset(asset);
                  setShowInspector(true);
                }}
              />
              {!isMobile && showInspector && (
                <AssetQuickInspector
                  asset={selectedAsset}
                  onClose={() => {
                    setShowInspector(false);
                    setSelectedAsset(null);
                  }}
                  isMobile={isMobile}
                />
              )}
            </div>
          </div>
        ) : (
          /* STANDARD USER VIEW */
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Welcome to your vault</h1>
            <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
              Become a verified creator to host and manage your uncompressed master files.
            </p>
            <a href="/become-creator" className="btn-solid" style={{ display: 'inline-block' }}>
              Become a creator
            </a>
          </div>
        )}
      </main>

      {/* MOBILE: Asset inspector as modal */}
      {isMobile && showInspector && (
        <AssetQuickInspector
          asset={selectedAsset}
          onClose={() => {
            setShowInspector(false);
            setSelectedAsset(null);
          }}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
