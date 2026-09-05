'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(10, 10, 10, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
    }}>
      <div style={{
        background: '#fff', border: '1px solid #dcdcd7', width: '100%', maxWidth: '420px',
        padding: '32px', position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '7px', height: '7px', background: '#0a0a0a' }}></span>
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>[ VAULT_AUTHENTICATION ]</span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'monospace' }}>[ X ]</button>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', borderBottom: '1px solid #dcdcd7' }}>
          {['LOGIN', 'SIGNUP'].map(m => (
            <button key={m} onClick={() => setMode(m as any)} style={{
              border: 'none', background: 'none', cursor: 'pointer',
              fontFamily: 'monospace', fontSize: '12px', paddingBottom: '12px',
              borderBottom: mode === m ? '2px solid #0a0a0a' : '2px solid transparent',
              fontWeight: mode === m ? 700 : 400
            }}>
              [{m}]
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #dcdcd7', fontFamily: 'monospace' }} required />
          <input type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #dcdcd7', fontFamily: 'monospace' }} required />
          
          {error && <span style={{ color: 'red', fontSize: '11px', fontFamily: 'monospace' }}>[ ERROR: {error} ]</span>}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: '#0a0a0a', color: '#fff', padding: '12px',
            border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: '12px'
          }}>
            {loading ? `[ ${mode === 'LOGIN' ? 'AUTHENTICATING' : 'CREATING_IDENTITY'}... ]` : `[ ${mode} ]`}
          </button>
        </form>
      </div>
    </div>
  );
}
