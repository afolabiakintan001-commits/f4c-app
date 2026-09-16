'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function BecomeCreatorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    }
    loadProfile();
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login?next=/become-creator');
        return;
      }

      // Proceed with checkout
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      const { url, error: checkoutError } = await res.json();
      if (checkoutError) throw new Error(checkoutError);

      window.location.href = url;
    } catch (err: any) {
      setError(err.message);
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

        {error && (
          <div style={{
            border: '1px solid rgba(239, 68, 68, 0.5)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'rgb(248, 113, 113)',
            padding: '12px',
            fontSize: '12px',
            fontFamily: 'monospace',
            borderRadius: '2px',
            marginBottom: '16px'
          }}>
            [ ERROR: {error} ]
          </div>
        )}

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
            {loading ? '[ REDIRECTING... ]' : '[ BECOME A CREATOR — £5 ]'}
          </button>
        )}
      </div>
    </div>
  );
}
