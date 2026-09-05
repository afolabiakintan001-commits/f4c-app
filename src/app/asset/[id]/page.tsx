'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';

export default function AssetDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [asset, setAsset] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [relatedAssets, setRelatedAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch asset and join creator
        const { data: assetData, error: fetchError } = await supabase
          .from('images')
          .select('*, profiles(*)')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setAsset(assetData);
        setCreator(assetData.profiles);

        // Fetch related assets
        const { data: relatedData } = await supabase
          .from('images')
          .select('*')
          .eq('category', assetData.category)
          .neq('id', id)
          .limit(4);
        setRelatedAssets(relatedData || []);

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

  if (loading) return <div className="mono" style={{ padding: '60px', textAlign: 'center' }}>[ INITIALIZING ASSET INSPECTOR... ]</div>;
  if (error) return <div className="mono" style={{ padding: '60px', textAlign: 'center' }}>[ ERROR: {error} ]</div>;
  if (!asset) return <div className="mono" style={{ padding: '60px', textAlign: 'center' }}>[ ASSET NOT FOUND ]</div>;

  return (
    <div className="wrap" style={{ marginTop: '32px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <Link href="/" className="link-plain mono">
          [ ← RETURN TO VAULT INDEX ]
        </Link>
        <div className="mono" style={{ fontSize: '13px', border: '1px solid #dcdcd7', padding: '6px 12px' }}>
          [ ASSET_CODE: {asset.id.slice(0, 8).toUpperCase()} ]
        </div>
      </div>

      {/* Two-Column Asset Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', marginBottom: '80px' }}>
        
        {/* Left Column: Preview */}
        <div style={{ 
          border: '1px solid #dcdcd7', 
          background: '#f1f1ef', 
          padding: '4px',
          position: 'relative'
        }}>
          <img src={asset.preview_url} alt={asset.title} style={{ width: '100%', display: 'block', height: 'auto' }} />
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: '#0a0a0a', color: '#fff', padding: '4px 8px', fontSize: '11px', fontFamily: 'monospace' }}>
            [ {asset.id.slice(0, 8).toUpperCase()} ]
          </div>
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#fff', border: '1px solid #dcdcd7', padding: '4px 8px', fontSize: '11px', fontFamily: 'monospace' }}>
            {asset.access_type}
          </div>
          <button style={{ position: 'absolute', bottom: '16px', right: '16px', background: '#fff', border: '1px solid #0a0a0a', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
            [ FULL_VIEW ]
          </button>
        </div>

        {/* Right Column: Readout */}
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '42px', fontWeight: 600, marginBottom: '24px', lineHeight: 1.1 }}>{asset.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <img src={creator?.avatar_url || '/placeholder.png'} alt="Creator" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontWeight: 600 }}>{creator?.username}</span>
            <div style={{ width: '6px', height: '6px', background: '#0a0a0a' }} />
          </div>

          <div className="readout" style={{ marginBottom: '24px' }}>
            <div className="readout-title">[ TECHNICAL READOUT ]</div>
            <div className="readout-row"><span className="k">RESOLUTION</span><span className="v">{asset.resolution || 'N/A'}</span></div>
            <div className="readout-row"><span className="k">FILE FORMAT</span><span className="v">{asset.file_type}</span></div>
            <div className="readout-row"><span className="k">ACCESS TYPE</span><span className="v">{asset.access_type}</span></div>
            <div className="readout-row"><span className="k">PRICE</span><span className="v">{asset.price_gbp > 0 ? `£${asset.price_gbp}` : 'FREE'}</span></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={handleDownload} className="btn-solid" style={{ width: '100%', padding: '14px', cursor: 'pointer' }}>[ DOWNLOAD MASTER FILE ]</button>
            <button className="btn-outline" style={{ width: '100%', padding: '14px', cursor: 'pointer' }}>[ COPY ASSET LINK ]</button>
          </div>
        </div>
      </div>

      {/* Related Assets Section */}
      <h3 style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '24px' }}>[ RELATED VAULT ASSETS ]</h3>
      <div className="contact-sheet">
        {relatedAssets.map(a => (
          <div key={a.id} className="frame">
            <div className="frame-img-wrap">
              <img src={a.preview_url} alt={a.title} />
              <div className="frame-code">[ {a.id.slice(0, 4).toUpperCase()} ]</div>
              <div className="frame-tier">{a.access_type}</div>
            </div>
            <div className="frame-caption">
              <span className="handle">{a.title}</span>
            </div>
          </div>
        ))}
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={() => {
          setIsAuthOpen(false);
          handleDownload();
        }}
      />
    </div>
  );
}
