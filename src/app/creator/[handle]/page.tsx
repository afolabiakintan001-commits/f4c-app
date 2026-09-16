import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function CreatorPage({ params }: { params: { handle: string } }) {
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, images(*)')
    .eq('username', params.handle)
    .single();

  if (error || !profile) notFound();

  return (
    <div className="page-wrapper" style={{ padding: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px' }}>{profile.full_name}</h1>
        <div className="mono" style={{ color: 'var(--muted)' }}>@{profile.username}</div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          {profile.instagram_handle && <a href={`https://instagram.com/${profile.instagram_handle}`}>IG</a>}
          {profile.x_handle && <a href={`https://x.com/${profile.x_handle}`}>X</a>}
          {profile.portfolio_url && <a href={profile.portfolio_url}>Portfolio</a>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {profile.images?.map((asset: any) => (
          <div key={asset.id} style={{ border: '1px solid var(--border)', padding: '8px' }}>
            <img src={asset.preview_url} alt={asset.title} style={{ width: '100%' }} />
            <div className="mono" style={{ fontSize: '12px' }}>{asset.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
