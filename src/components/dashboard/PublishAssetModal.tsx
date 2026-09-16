'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface PublishAssetModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PublishAssetModal({ onClose, onSuccess }: PublishAssetModalProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [accessType, setAccessType] = useState<'FREE' | 'FULLY_FREE' | 'MONEY'>('FREE');
  const [price, setPrice] = useState('');
  const supabase = createClient();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Upload to Supabase Storage (assets bucket)
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName);

      // 3. Create database record
      const { error: dbError } = await supabase.from('images').insert({
        user_id: user.id,
        title,
        category: 'general',
        file_type: file.type,
        preview_url: publicUrl,
        master_file_url: publicUrl,
        access_type: accessType,
        price_gbp: accessType === 'MONEY' ? parseFloat(price) : 0,
      });

      if (dbError) throw dbError;

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <form onSubmit={handleUpload} className="card" style={{ width: '440px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Publish master file</h2>
        
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" />
        
        <div style={{ display: 'flex', gap: '12px', padding: '12px 0' }}>
          {(['FREE', 'FULLY_FREE', 'MONEY'] as const).map(type => (
            <label key={type} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input type="radio" checked={accessType === type} onChange={() => setAccessType(type)} />
              {type}
            </label>
          ))}
        </div>

        {accessType === 'MONEY' && (
          <input type="number" placeholder="Price (GBP)" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" />
        )}

        <button type="submit" className="btn-solid" disabled={loading}>{loading ? 'Publishing...' : '[ publish_to_vault ]'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
