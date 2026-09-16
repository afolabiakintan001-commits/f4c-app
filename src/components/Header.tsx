'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  useEffect(() => {
    // Get initial auth state
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    loadUser();

    // Listen for auth updates (login, logout, signup)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuth = (mode: 'LOGIN' | 'SIGNUP') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <>
      <header 
        className="mono"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #dcdcd7',
          padding: '12px 24px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Brand Moniker */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              background: '#0a0a0a', 
              color: '#ffffff', 
              padding: '3px 8px', 
              fontWeight: 700, 
              fontSize: '12px',
              letterSpacing: '1px' 
            }}>
              F4C
            </span>
            <span style={{ 
              fontFamily: 'Space Grotesk, sans-serif', 
              fontWeight: 700, 
              fontSize: '15px', 
              color: '#0a0a0a',
              letterSpacing: '-0.5px'
            }}>
              F4Creators
            </span>
          </Link>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Upload Button */}
            <Link 
              href="/submit" 
              style={{ 
                border: '1px solid #dcdcd7',
                padding: '6px 12px',
                fontSize: '11px',
                color: '#0a0a0a',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                fontFamily: 'var(--plex-mono)',
              }}
            >
              Index asset
            </Link>

            {/* Auth Session Controls */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#71716b' }}>
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: 'transparent',
                    border: '1px solid #dcdcd7',
                    padding: '6px 10px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'var(--plex-mono)',
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => openAuth('LOGIN')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #dcdcd7',
                    padding: '6px 10px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'var(--plex-mono)',
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth('SIGNUP')}
                  style={{
                    background: '#0a0a0a',
                    color: '#ffffff',
                    border: '1px solid #0a0a0a',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'var(--plex-mono)',
                  }}
                >
                  Register
                </button>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Auth Modal Integration */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
