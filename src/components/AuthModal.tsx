'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        setSuccessMsg('[ SESSION VERIFIED — ACCESS GRANTED ]');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 800);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        setSuccessMsg('[ ACCOUNT CREATED — CHECK EMAIL FOR VERIFICATION LINK ]');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 10, 10, 0.75)',
        backdropFilter: 'blur(2px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="mono"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          border: '2px solid #0a0a0a',
          boxShadow: '8px 8px 0px #0a0a0a',
          padding: '28px',
          position: 'relative',
        }}
      >
        {/* Top Ledger Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: '#0a0a0a', 
              color: '#ffffff', 
              padding: '2px 6px', 
              fontWeight: 700, 
              fontSize: '11px',
              letterSpacing: '1px' 
            }}>
              F4C
            </span>
            <span style={{ fontSize: '11px', color: '#71716b' }}>
              [ AUTH_TERMINAL ]
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #dcdcd7',
              cursor: 'pointer',
              fontSize: '11px',
              padding: '2px 8px',
              fontFamily: 'inherit',
            }}
          >
            [ ESC ]
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setMode('LOGIN'); setErrorMsg(null); setSuccessMsg(null); }}
            style={{
              padding: '10px',
              border: '1px solid #0a0a0a',
              background: mode === 'LOGIN' ? '#0a0a0a' : '#ffffff',
              color: mode === 'LOGIN' ? '#ffffff' : '#0a0a0a',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'center',
            }}
          >
            01. LOGIN
          </button>
          <button
            type="button"
            onClick={() => { setMode('SIGNUP'); setErrorMsg(null); setSuccessMsg(null); }}
            style={{
              padding: '10px',
              border: '1px solid #0a0a0a',
              background: mode === 'SIGNUP' ? '#0a0a0a' : '#ffffff',
              color: mode === 'SIGNUP' ? '#ffffff' : '#0a0a0a',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'center',
            }}
          >
            02. REGISTER
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#71716b', marginBottom: '6px' }}>
              CREATOR_EMAIL
            </label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="editor@f4creators.com"
              style={{ 
                border: '1px solid #dcdcd7', 
                padding: '10px', 
                width: '100%', 
                fontSize: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                background: '#fafaf9',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#71716b', marginBottom: '6px' }}>
              SECURITY_KEY
            </label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••••••"
              style={{ 
                border: '1px solid #dcdcd7', 
                padding: '10px', 
                width: '100%', 
                fontSize: '12px',
                fontFamily: 'inherit',
                outline: 'none',
                background: '#fafaf9',
              }}
            />
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div style={{ 
              border: '1px solid #dc2626', 
              background: '#fef2f2', 
              color: '#dc2626', 
              padding: '8px 10px', 
              fontSize: '11px' 
            }}>
              [ ERROR: {errorMsg} ]
            </div>
          )}

          {successMsg && (
            <div style={{ 
              border: '1px solid #16a34a', 
              background: '#f0fdf4', 
              color: '#16a34a', 
              padding: '8px 10px', 
              fontSize: '11px' 
            }}>
              {successMsg}
            </div>
          )}

          {/* Action Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: '#0a0a0a', 
              color: '#ffffff', 
              padding: '12px', 
              border: 'none', 
              cursor: 'pointer', 
              marginTop: '8px', 
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'inherit',
              letterSpacing: '0.5px'
            }}
          >
            {loading 
              ? '[ PROCESSING SEQUENCE... ]' 
              : mode === 'LOGIN' 
                ? '[ AUTHENTICATE CREATOR ]' 
                : '[ INITIALIZE CREATOR ACCOUNT ]'
            }
          </button>
        </form>

        {/* Footer info */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #dcdcd7', fontSize: '10px', color: '#71716b', textAlign: 'center' }}>
          UNCOMPRESSED ASSET VAULT • SECURED BY SUPABASE
        </div>
      </div>
    </div>
  );
}
