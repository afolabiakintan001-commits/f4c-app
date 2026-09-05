'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPLOADED' | 'DOWNLOADS' | 'SETTINGS'>('UPLOADED');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div className="mono p-8">[ INITIALIZING_SESSION... ]</div>;

  if (!user) {
    return (
      <div className="mono p-8 flex flex-col gap-4">
        <div style={{ color: '#dc2626', fontWeight: 700 }}>[ ACCESS_DENIED: AUTH_REQUIRED ]</div>
        <button 
          onClick={() => setIsAuthOpen(true)}
          style={{ background: '#0a0a0a', color: '#fff', padding: '8px 16px', width: 'fit-content', fontSize: '12px' }}
        >
          [ INITIALIZE_LOGIN ]
        </button>
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="mono p-8 flex flex-col gap-8 max-w-[1200px] mx-auto">
      {/* Profile Header */}
      <header className="border-b border-[#0a0a0a] pb-8">
        <h1 className="text-[24px] font-bold">[ CREATOR_PROFILE_MANIFEST ]</h1>
        <div className="flex gap-4 text-[12px] text-[#71716b] mt-2">
          <span>[ ID: {user.id} ]</span>
          <span>[ EMAIL: {user.email} ]</span>
          <span>[ CREATED: {new Date(user.created_at).toLocaleDateString()} ]</span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex gap-4 border-b border-[#dcdcd7]">
        {(['UPLOADED', 'DOWNLOADS', 'SETTINGS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderBottom: activeTab === tab ? '2px solid #0a0a0a' : '2px solid transparent',
              fontSize: '12px',
              fontWeight: activeTab === tab ? 700 : 400,
            }}
          >
            [ {tab.replace('_', ' ')} ]
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main>
        {activeTab === 'UPLOADED' && <UploadedAssetsView userId={user.id} />}
        {activeTab === 'DOWNLOADS' && <div className="p-8 text-[#71716b]">[ DOWNLOAD_HISTORY: EMPTY_MANIFEST ]</div>}
        {activeTab === 'SETTINGS' && <AccountSettingsView user={user} />}
      </main>
    </div>
  );
}

function UploadedAssetsView({ userId }: { userId: string }) {
  // Placeholder for assets fetch
  return (
    <div className="p-4 border border-[#dcdcd7] text-[#71716b] text-[12px]">
      [ DATA_STREAM: FETCHING_ASSETS_FOR_USER_{userId}... ]
    </div>
  );
}

function AccountSettingsView({ user }: { user: any }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col gap-4">
      <button 
        onClick={handleSignOut}
        style={{ background: '#dc2626', color: '#fff', padding: '8px 16px', width: 'fit-content', fontSize: '12px' }}
      >
        [ TERMINATE_SESSION ]
      </button>
    </div>
  );
}
