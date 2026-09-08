'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function BecomeCreatorPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    loadUser();
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      alert('Please log in or create an account first.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const { url, error } = await res.json();
      if (error) throw new Error(error);

      window.location.href = url;
    } catch (err: any) {
      alert(`Checkout failed: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 20px' }} className="mono">
      <div style={{ border: '1px solid #dcdcd7', padding: '32px', background: '#fff' }}>
        <span style={{ fontSize: '11px', color: '#71716b' }}>[ CREATOR VERIFICATION ]</span>
        <h1 style={{ fontSize: '24px', fontFamily: 'Space Grotesk, sans-serif', margin: '12px 0 16px' }}>
          Become a Verified Creator
        </h1>

        <p style={{ fontSize: '13px', color: '#71716b', lineHeight: '1.6', marginBottom: '24px' }}>
          F4C keeps image vaults uncompressed and free from platform watermarks. To prevent spam and index quality master files, creator accounts require a one-time £5 activation fee.
        </p>

        <div style={{ borderTop: '1px solid #dcdcd7', borderBottom: '1px solid #dcdcd7', padding: '16px 0', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span>UNLIMITED MASTER UPLOADS</span>
            <span>✓ ENABED</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span>VERIFIED CREATOR BADGE</span>
            <span>✓ INCLUDED</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span>ACTIVATION FEE</span>
            <span style={{ fontWeight: 600 }}>£5.00 GBP (ONE-TIME)</span>
          </div>
        </div>

        {profile?.is_creator ? (
          <div style={{ background: 'var(--hover-fill)', padding: '14px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
            [ YOUR ACCOUNT IS ALREADY VERIFIED ]
          </div>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: '100%', background: '#0a0a0a', color: '#fff',
              padding: '14px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 500
            }}
          >
            {loading ? '[ REDIRECTING TO STRIPE... ]' : '[ BECOME A CREATOR — £5 ]'}
          </button>
        )}
      </div>
    </div>
  );
}
