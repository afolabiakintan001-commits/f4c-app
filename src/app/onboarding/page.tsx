'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function OnboardingPage() {
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [instagram, setInstagram] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (handle.length < 3) {
      setHandleAvailable(null);
      return;
    }

    const checkHandle = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', handle.toLowerCase())
        .maybeSingle(); // Use maybeSingle to avoid 406/error on not found
      
      setHandleAvailable(data ? false : true);
    };

    const timer = setTimeout(checkHandle, 500);
    return () => clearTimeout(timer);
  }, [handle, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleAvailable) return;
    
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setError('User not found');
        setLoading(false);
        return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: handle.toLowerCase(),
        full_name: displayName,
        instagram_handle: instagram,
        x_handle: xHandle,
        portfolio_url: portfolio,
        is_creator: true
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card" style={{ maxWidth: '440px', width: '100%' }}>
        <h1 style={{ fontSize: '22px', marginBottom: '8px' }}>Creator Setup</h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
          Complete your profile to unlock publishing.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="input-label">Handle</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 8px' }}>
              <span className="mono" style={{ color: 'var(--muted)' }}>@</span>
              <input
                type="text"
                className="input-field"
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                required
                style={{ border: 'none', width: '100%', padding: '8px' }}
                placeholder="handle"
              />
            </div>
            {handleAvailable === false && <p style={{ fontSize: '11px', color: '#b91c1c', marginTop: '4px' }}>Handle taken</p>}
          </div>

          <div>
            <label className="input-label">Display Name</label>
            <input
              type="text"
              className="input-field"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            />
          </div>

          <div>
            <label className="input-label">Instagram Handle (@...)</label>
            <input
              type="text"
              className="input-field"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            />
          </div>

          <div>
            <label className="input-label">X Handle (@...)</label>
            <input
              type="text"
              className="input-field"
              value={xHandle}
              onChange={(e) => setXHandle(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            />
          </div>

          <div>
            <label className="input-label">Portfolio URL</label>
            <input
              type="url"
              className="input-field"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            />
          </div>

          {error && <p style={{ fontSize: '12px', color: '#b91c1c' }}>{error}</p>}


          <button 
            type="submit" 
            className="btn-solid" 
            disabled={loading || handleAvailable !== true}
            style={{ width: '100%' }}
          >
            {loading ? 'Saving...' : '[ complete_setup ]'}
          </button>
        </form>
      </div>
    </div>
  );
}
