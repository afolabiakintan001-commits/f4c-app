'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../globals.css';

interface LoginFormState {
  email: string;
  password: string;
  creatorHandle: string;
  intent: 'login' | 'creator' | null;
}

export default function LoginPage() {
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    creatorHandle: '',
    intent: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleInputChange = (field: keyof LoginFormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    // TODO: Integrate with Supabase Google OAuth
    try {
      console.log('Google auth triggered');
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!formState.email) {
      setError('Please enter your email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError(null);
    // TODO: Send magic link via Supabase
    try {
      console.log('Magic link sent to:', formState.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCreatorHandle = async () => {
    if (!formState.creatorHandle) {
      setError('Please enter a creator handle');
      return;
    }
    if (formState.creatorHandle.length < 3) {
      setError('Handle must be at least 3 characters');
      return;
    }
    setLoading(true);
    setError(null);
    // TODO: Validate handle availability and trigger Google/Magic link
    try {
      console.log('Claiming creator handle:', formState.creatorHandle);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Handle is already taken. Please try another.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // Mobile flow: single streamlined Google action
  if (isMobile) {
    return (
      <div className="page-wrapper">
        <div className="card" style={{ maxWidth: '440px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>F4C Vault</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }} className="mono">
              uncompressed · unwatermarked
            </div>
          </div>

          <h1 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '16px' }}>
            Access your vault
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--muted)', textAlign: 'center', marginBottom: '24px', lineHeight: 1.6 }}>
            Sign in with your Google account to explore verified creators' uncompressed assets.
          </p>

          {error && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(160, 0, 0, 0.1)',
                border: '1px solid rgba(160, 0, 0, 0.3)',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
                color: '#a00',
                marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          <button
            className="btn-bracket"
            onClick={handleGoogleAuth}
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? '[ connecting... ]' : '[ continue_with_google ]'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '12px' }}>
            <span>Don't have an account? </span>
            <Link href="/become-creator" style={{ color: 'var(--ink)', textDecoration: 'underline', fontWeight: 600 }}>
              Become a creator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Desktop flow: dual-intent layout
  return (
    <div className="page-wrapper">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '100%', maxWidth: '960px' }}>
        {/* LEFT: Universal Login */}
        <div className="card">
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Enter the vault</h2>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }} className="mono">
              browse & purchase assets
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: '12px',
                background: 'rgba(160, 0, 0, 0.1)',
                border: '1px solid rgba(160, 0, 0, 0.3)',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
                color: '#a00',
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="input-label">email address</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={formState.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="input-label">password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={formState.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            className="btn-solid"
            onClick={handleMagicLink}
            disabled={loading}
            style={{ marginTop: '8px', width: '100%' }}
          >
            {loading ? 'Sending...' : '[ enter_vault ]'}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', marginTop: '12px' }}>
            Or{' '}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink)',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: 'Space Grotesk',
                fontSize: 'inherit',
              }}
            >
              continue with Google
            </button>
          </p>
        </div>

        {/* RIGHT: Creator Handle Claim */}
        <div className="card">
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Claim creator handle</h2>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }} className="mono">
              publish uncompressed assets
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '12px' }}>
            Verified creators host 4K master files with zero compression. Check handle availability and claim yours.
          </p>

          <div>
            <label className="input-label">creator handle</label>
            <input
              type="text"
              className="input-field"
              placeholder="yourhandle"
              value={formState.creatorHandle}
              onChange={(e) => handleInputChange('creatorHandle', e.target.value.replace(/^@/, '').toLowerCase())}
              disabled={loading}
            />
            <div style={{ fontSize: '11px', color: 'var(--placeholder)', marginTop: '4px' }}>
              lowercase, no spaces. linked from all platforms.
            </div>
          </div>

          <button
            className="btn-solid"
            onClick={handleClaimCreatorHandle}
            disabled={loading}
            style={{ marginTop: '16px', width: '100%' }}
          >
            {loading ? 'Checking...' : '[ claim_handle ]'}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', marginTop: '12px' }}>
            Setup fee: <span style={{ fontWeight: 600, color: 'var(--ink)' }}>£5</span>
          </p>
        </div>
      </div>
    </div>
  );
}
