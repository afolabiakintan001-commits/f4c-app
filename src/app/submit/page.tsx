'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal';

const BROAD_CATEGORIES = ['Frames & Stills', 'Textures & Overlays', 'Presets & Project Files', '3D & Graphics'];

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(BROAD_CATEGORIES[0]);
  const [detectedFormat, setDetectedFormat] = useState('UNKNOWN');
  const [resolution, setResolution] = useState('MASTER FILE');
  const [rawTags, setRawTags] = useState('');
  const [accessType, setAccessType] = useState<'FREE' | 'FULLY_FREE' | 'MONEY'>('FREE');
  const [priceGbp, setPriceGbp] = useState('0.00');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    const ext = selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE';
    setDetectedFormat(ext);

    if (selectedFile.type.startsWith('image/')) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      img.onload = () => setResolution(`${img.width}×${img.height}`);
    } else {
      setResolution('MASTER FILE');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert('Select a master file and provide a title.');

    // Inline auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    await processUpload(user.id);
  };

  const processUpload = async (userId: string) => {
    setUploading(true);
    setUploadProgress('[ INDEXING_TO_VAULT... ]');

    try {
      // 1. Upload to Storage
      const fileExt = file!.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}_${Math.random()}.${fileExt}`;
      const { error: storageError, data: storageData } = await supabase.storage
        .from('assets')
        .upload(filePath, file!);

      if (storageError) throw storageError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);

      // 3. Database Insert
      const tagsArray = rawTags.split(',').map(t => t.trim().toLowerCase().replace('#', '')).filter(t => t.length > 0);
      const { error: dbError } = await supabase.from('images').insert({
        user_id: userId,
        title,
        category,
        file_type: detectedFormat,
        tags: tagsArray,
        preview_url: publicUrl,
        master_file_url: publicUrl,
        resolution,
        access_type: accessType,
        price_gbp: accessType === 'MONEY' ? parseFloat(priceGbp) : 0,
      });

      if (dbError) throw dbError;
      alert('Asset indexed successfully!');
      router.push('/');
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 20px', fontFamily: 'monospace' }}>
      <div style={{ border: '1px solid #0a0a0a', padding: '32px', background: '#fff', boxShadow: '6px 6px 0px #0a0a0a' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', color: '#71716b' }}>[ INDEX NEW ASSET ]</span>
          <span style={{ background: '#0a0a0a', color: '#fff', padding: '2px 8px', fontSize: '11px', fontWeight: 700 }}>F4CREATORS</span>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); }}
          style={{
            border: isDragging ? '2px dashed #0a0a0a' : '2px dashed #dcdcd7',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])} style={{ display: 'none' }} />
          {file ? <span style={{ fontSize: '12px' }}>[ MASTER_FILE_ATTACHED: {file.name} ]</span> : <span style={{ fontSize: '12px' }}>[ DRAG MASTER FILE HERE OR CLICK TO BROWSE ]</span>}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {/* ... Other Fields (Title, Category, Tags, AccessType) ... */}
           {/* Similar to before, I'll keep the form simple but structured as requested */}
           <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#71716b', marginBottom: '6px' }}>ASSET TITLE</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ border: '1px solid #dcdcd7', padding: '10px', width: '100%', fontFamily: 'monospace' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#71716b', marginBottom: '6px' }}>BROAD CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ border: '1px solid #dcdcd7', padding: '10px', width: '100%', fontFamily: 'monospace' }}>
              {BROAD_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#71716b', marginBottom: '6px' }}>CUSTOM TAGS (COMMA SEPARATED)</label>
            <input type="text" value={rawTags} onChange={(e) => setRawTags(e.target.value)} style={{ border: '1px solid #dcdcd7', padding: '10px', width: '100%', fontFamily: 'monospace' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#71716b', marginBottom: '6px' }}>ACCESS TIER</label>
            <select value={accessType} onChange={(e: any) => setAccessType(e.target.value)} style={{ border: '1px solid #dcdcd7', padding: '10px', width: '100%', fontFamily: 'monospace' }}>
              <option value="FREE">FREE</option>
              <option value="FULLY_FREE">FULLY FREE</option>
              <option value="MONEY">PAID</option>
            </select>
          </div>
          {accessType === 'MONEY' && (
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#71716b', marginBottom: '6px' }}>PRICE (£ GBP)</label>
              <input type="number" step="0.50" value={priceGbp} onChange={(e) => setPriceGbp(e.target.value)} style={{ border: '1px solid #dcdcd7', padding: '10px', width: '100%', fontFamily: 'monospace' }} />
            </div>
          )}

           <button type="submit" disabled={uploading} style={{ background: '#0a0a0a', color: '#fff', padding: '14px', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace' }}>
            {uploading ? uploadProgress : '[ PUBLISH TO F4CREATORS VAULT ]'}
          </button>
        </form>
      </div>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={async () => {
          setIsAuthOpen(false);
          const { data: { user } } = await supabase.auth.getUser();
          if (user) await processUpload(user.id);
        }} 
      />
    </div>
  );
}
