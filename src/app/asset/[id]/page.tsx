'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';

export default function AssetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: assetData, error: fetchError } = await supabase
          .from('images')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setAsset(assetData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    }

    fetchData();
    checkAuth();
  }, [id]);

  const handleDownload = () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    // Proceed to download/redirect
    window.open(asset.master_file_url, '_blank');
  };

  if (loading) return <div className="mono" style={{ padding: '40px' }}>[ LOADING ASSET... ]</div>;
  if (error) return <div className="mono" style={{ padding: '40px' }}>[ ERROR: {error} ]</div>;
  if (!asset) return <div className="mono" style={{ padding: '40px' }}>[ ASSET NOT FOUND ]</div>;

  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }} className="mono">
        <Link href="/" style={{ color: '#71716b', fontSize: '11px', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
          [ ← RETURN TO VAULT INDEX ]
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', marginTop: '20px' }}>
          {/* Left Column: Preview */}
          <div style={{ border: '2px solid #0a0a0a', padding: '4px', boxShadow: '8px 8px 0px #0a0a0a', background: '#fff' }}>
             <img src={asset.preview_url} alt={asset.title} style={{ width: '100%', display: 'block' }} />
          </div>

          {/* Right Column: Ledger */}
          <div style={{ border: '1px solid #dcdcd7', background: '#fff', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontFamily: 'Space Grotesk, sans-serif', margin: '0 0 8px' }}>{asset.title}</h1>
              <span style={{ fontSize: '11px', color: '#71716b' }}>[ ASSET_ID: {asset.id.slice(0, 8)} ]</span>
            </div>

            <div style={{ borderTop: '1px solid #dcdcd7', pt: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f1ef' }}>
                <span style={{ fontSize: '11px', color: '#71716b' }}>CATEGORY</span>
                <span style={{ fontSize: '11px', fontWeight: 600 }}>{asset.category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f1ef' }}>
                <span style={{ fontSize: '11px', color: '#71716b' }}>FORMAT</span>
                <span style={{ fontSize: '11px', fontWeight: 600 }}>{asset.file_type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f1ef' }}>
                <span style={{ fontSize: '11px', color: '#71716b' }}>RESOLUTION</span>
                <span style={{ fontSize: '11px', fontWeight: 600 }}>{asset.resolution}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f1ef' }}>
                <span style={{ fontSize: '11px', color: '#71716b' }}>ACCESS</span>
                <span style={{ fontSize: '11px', fontWeight: 600 }}>{asset.access_type}</span>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              style={{ 
                background: '#0a0a0a', 
                color: '#fff', 
                padding: '14px', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'inherit',
                letterSpacing: '0.5px'
              }}
            >
              [ DOWNLOAD MASTER FILE ]
            </button>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={() => {
          setIsAuthOpen(false);
          setCurrentUser(true); // Simplified auth update
          handleDownload();
        }}
      />
    </>
  );
}
