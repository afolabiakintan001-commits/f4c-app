'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [accessTier, setAccessTier] = useState<'FREE' | 'PRO' | 'PARTNER'>('FREE');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !title) return alert('Please attach a file and provide a title.');
    
    setUploading(true);
    // ... logic for upload/db insert ...
    setUploading(false);
    alert('[ SUCCESS: ASSET_PUBLISHED_TO_VAULT ]');
    router.push('/');
  };

  return (
    <div className="vault-page">
      <div className="submit-card">
        <div className="card-tag">[ phase 2 · submit ]</div>

        <div className="card-header">
          <span className="mark" />
          <h1>Publish a master file</h1>
        </div>
        <p className="lede">
          Upload the original, uncompressed version — no platform compression,
          no watermark, no guesswork for your fans.
        </p>

        <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round"/>
          </svg>
          <div className="dz-main">{file ? file.name : "Drag your file here, or click to browse"}</div>
          <div className="dz-sub mono">RAW · PNG · MOV · MP4 · ProRes — 4K minimum</div>
        </div>

        <label className="field-label">Give it a name</label>
        <input 
            className="field-input" 
            placeholder="e.g. Tokyo Night 01 — Master 4K" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        <label className="field-label">How do you want to release this?</label>
        <div className="tier-grid">
          {(['FREE', 'PRO', 'PARTNER'] as const).map((tier) => (
            <button 
                key={tier}
                className={`tier-card ${accessTier === tier ? 'selected' : ''}`}
                onClick={() => setAccessTier(tier)}
            >
                <div className="tier-name">{tier.charAt(0) + tier.slice(1).toLowerCase()}</div>
                <div className="tier-desc">
                    {tier === 'FREE' && 'Fans redeem 100 points to download'}
                    {tier === 'PRO' && 'Set your own price, $1–$5'}
                    {tier === 'PARTNER' && 'You cover the cost — free for every fan'}
                </div>
            </button>
          ))}
        </div>

        <button className="btn-publish mono" onClick={handleSubmit} disabled={uploading}>
          {uploading ? '[ PUBLISHING... ]' : '[ publish to vault ]'}
        </button>
        <div className="helper-text">You can edit the price and details anytime after publishing.</div>
      </div>
    </div>
  );
}
