'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ProfileDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPLOADED' | 'DOWNLOADS' | 'SETTINGS'>('UPLOADED');
  const [assets, setAssets] = useState<any[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error'); // Basic query param error handling

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data } = await supabase
          .from('images')
          .select('*')
          .eq('user_id', user.id);
        setAssets(data || []);
      }
      setLoading(false);
    };

    // Listen for auth state changes, specifically SIGNED_IN to auto-update UI
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        window.location.reload(); // Refresh to fetch assets
      }
    });

    init();
    return () => subscription.unsubscribe();
  }, []);

  const handleDelete = async (assetId: string, url: string) => {
    if (!confirm('[ CONFIRM: DELETE_ASSET_FROM_VAULT? ]')) return;
    
    // Delete from storage
    const path = url.split('/').pop()!;
    await supabase.storage.from('assets').remove([path]);
    
    // Delete from DB
    await supabase.from('images').delete().eq('id', assetId);
    setAssets(assets.filter(a => a.id !== assetId));
  };

  if (loading) return <div className="mono p-8">[ INITIALIZING_SESSION... ]</div>;

  if (!user) {
    return (
      <div className="page-wrapper min-h-screen flex items-center justify-center p-6">
        <div className="card w-full max-w-[420px] p-8 border border-[#dcdcd7] bg-white" style={{borderRadius: '2px'}}>
          <h1 className="font-['Space_Grotesk'] text-[20px] font-bold text-[#0a0a0a] mb-2">
            {errorParam ? 'Sign in failed' : 'Sign in to view this page'}
          </h1>
          <p className="font-['Space_Grotesk'] text-[14px] text-[#71716b] mb-8">
            {errorParam ? errorParam.replace(/_/g, ' ') : 'Authentication is required to access your dashboard and vault.'}
          </p>
          <button 
            onClick={() => setIsAuthOpen(true)} 
            className="w-full px-[18px] py-[11px] bg-[#0a0a0a] text-white font-['IBM_Plex_Mono'] text-[13.5px] font-medium tracking-wide"
            style={{ borderRadius: '2px' }}
          >
            [ log in ]
          </button>
        </div>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="wrap max-w-[1440px] mx-auto px-8 py-12 mono">
      {/* Header Block */}
      <div className="flex items-center gap-3 mb-8">
        <div className="sq w-[7px] h-[7px] bg-black" />
        <h1 className="text-[24px] font-semibold tracking-tight">Your profile</h1>
        <span className="text-[10px] font-mono border border-black px-1 ml-auto">[ CREATOR_DASHBOARD ]</span>
      </div>
      
      {/* Profile Identity Row */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full border border-[#dcdcd7]" />
          <div>
            <h2 className="text-[20px] font-bold">{user.email?.split('@')[0]} <span className="sq inline-block w-[7px] h-[7px] bg-black"></span></h2>
            <p className="text-[#71716b] text-[12px]">{user.email}</p>
            <p className="text-[#71716b] text-[12px]">JOINED: {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="border border-[#0a0a0a] px-4 py-2 text-[11px]">[ EDIT PROFILE ]</button>
          <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="border border-[#0a0a0a] px-4 py-2 text-[11px]">[ SIGNOUT ]</button>
        </div>
      </div>

      {/* Technical Readout Panel */}
      <div className="readout grid grid-cols-4 border border-[#dcdcd7] mb-12">
        {[
          { label: 'INDEXED ASSETS', val: assets.length },
          { label: 'TOTAL DOWNLOADS', val: '0' },
          { label: 'ACTIVE TIER', val: 'VERIFIED' },
          { label: 'VAULT STORAGE', val: '0.00 GB / UNLIMITED' }
        ].map(stat => (
          <div key={stat.label} className="p-6 border-r last:border-0 border-[#dcdcd7]">
            <p className="text-[10px] text-[#71716b]">{stat.label}</p>
            <p className="text-[16px] font-bold">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Sub-Header Navigation Ledger */}
      <nav className="ledger flex gap-8 mb-8 border-b border-[#dcdcd7]">
        <button onClick={() => setActiveTab('UPLOADED')} className={`pb-4 text-[13px] ${activeTab === 'UPLOADED' ? 'font-bold border-b-2 border-black' : ''}`}>Uploaded Assets ({assets.length})</button>
        <button onClick={() => setActiveTab('DOWNLOADS')} className={`pb-4 text-[13px] ${activeTab === 'DOWNLOADS' ? 'font-bold border-b-2 border-black' : ''}`}>Saved / Downloaded</button>
        <button onClick={() => setActiveTab('SETTINGS')} className={`pb-4 text-[13px] ${activeTab === 'SETTINGS' ? 'font-bold border-b-2 border-black' : ''}`}>Vault Settings</button>
      </nav>

      {/* Contact Sheet Asset Grid */}
      {activeTab === 'UPLOADED' && (
        <div className="contact-sheet grid grid-cols-6 gap-0 border-t border-l border-[#dcdcd7]">
          {assets.map((asset) => (
            <div key={asset.id} className="aspect-[4/5] border-r border-b border-[#dcdcd7] p-2 relative group">
              <img src={asset.preview_url} alt={asset.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 text-[9px] bg-white px-1 border border-black">[ F{asset.id.slice(0,3)} ]</div>
              <div className="absolute top-4 right-4 text-[9px] bg-black text-white px-1">{asset.access_type}</div>
              <div className="absolute bottom-4 left-4 text-[10px] font-bold">{asset.title}</div>
              
              {/* Action Overlay */}
              <div className="absolute inset-0 bg-white/80 hidden group-hover:flex flex-col items-center justify-center gap-2">
                <button className="text-[10px] border border-black px-2 py-1">[ EDIT ]</button>
                <button onClick={() => handleDelete(asset.id, asset.master_file_url)} className="text-[10px] border border-red-600 text-red-600 px-2 py-1">[ DELETE ]</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="mono p-8">[ INITIALIZING_SESSION... ]</div>}>
      <ProfileDashboard />
    </Suspense>
  );
}
