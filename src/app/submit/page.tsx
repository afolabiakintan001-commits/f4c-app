'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { ValidationBanner } from '@/components/validation';

const AVAILABLE_TAGS = ["RAW", "4K", "PRORES", "PORTRAIT", "LANDSCAPE", "STREET", "EDITORIAL", "ARCHITECTURAL", "MONOCHROME", "STUDIO"];

export default function SubmitPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileMeta, setFileMeta] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allowComments, setAllowComments] = useState(true);
  const [notifyDownloads, setNotifyDownloads] = useState(true);
  const [accessTier, setAccessTier] = useState<'FREE' | 'PRO' | 'PARTNER'>('FREE');
  const [proPrice, setProPrice] = useState('3');
  const [uploading, setUploading] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const supabase = createClient();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationIssues(['Only uncompressed image formats accepted']);
        setFile(null);
        return;
      }
      setValidationIssues([]);
      setFile(file);

      // Extract metadata
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFileMeta(`${sizeMB}MB · ${img.width}x${img.height} · ${file.type.split('/')[1].toUpperCase()}`);
    }
  };

  const handleSubmit = async () => {
    const issues = [];
    if (!file) issues.push('Attach an image');
    if (!title) issues.push('Provide a title');

    if (issues.length > 0) {
        setValidationIssues(issues);
        return;
    }
    
    setValidationIssues([]);
    setUploading(true);
    // ... logic for upload/db insert ...
    // Note: This is where we'd pass description, tags, engagement controls, and fileMeta to the DB
    setUploading(false);
    router.push('/dashboard');
  };

  return (
    <div className="vault-page">
      <div className="submit-card">
        <div className="card-tag">Phase 2 · Submit</div>

        <div className="card-header">
          <span className="mark" />
          <h1>Publish a master file</h1>
        </div>
        <p className="lede">
          Upload the original, uncompressed version — no platform compression,
          no watermark, no guesswork for your fans.
        </p>

        <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp, image/tiff, image/x-canon-cr2, image/x-nikon-nef, image/x-sony-arw"
          />
          <div className="dz-corners-bottom" />
          <div className="dz-tag mono">{file ? "[ file received ]" : "[ awaiting file ]"}</div>
          
          {file ? (
            <div className="dz-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src={URL.createObjectURL(file)} alt="preview" style={{ maxHeight: '100px', maxWidth: '100px', objectFit: 'cover', borderRadius: '2px' }} />
              <div className="mono" style={{ fontSize: '13px' }}>{file.name}</div>
              <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>{fileMeta}</div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); setFileMeta(null); }} className="mono" style={{ fontSize: '10px', color: 'var(--muted)', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>[ remove ]</button>
            </div>
          ) : (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round"/>
              </svg>
              <div className="dz-main">Drag your file here, or click to browse</div>
              <div className="dz-sub mono">RAW · PNG · MOV · MP4 · ProRes — 4K minimum</div>
            </>
          )}
        </div>

        <label className="field-label">Give it a name</label>
        <input 
            className="field-input" 
            placeholder="e.g. Tokyo Night 01 — Master 4K" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        <label className="field-label">Description / Licensing Context</label>
        <textarea 
            className="field-input" 
            rows={3}
            placeholder="Context for your fans..." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />

        <label className="field-label">Tags</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {AVAILABLE_TAGS.map(tag => (
                <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                        padding: '4px 8px',
                        border: `1px solid ${selectedTags.includes(tag) ? 'var(--ink)' : 'var(--border)'}`,
                        background: selectedTags.includes(tag) ? 'var(--hover-fill)' : 'transparent',
                        fontSize: '11px',
                        fontFamily: 'var(--plex-mono)',
                        cursor: 'pointer',
                        opacity: selectedTags.includes(tag) ? 1 : 0.7
                    }}
                >
                    {tag}
                </button>
            ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={allowComments} onChange={() => setAllowComments(!allowComments)} />
                Allow community comments on this vault item
            </label>
            <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifyDownloads} onChange={() => setNotifyDownloads(!notifyDownloads)} />
                Notify me when master file is downloaded
            </label>
        </div>

        <label className="field-label" style={{ marginTop: '16px' }}>How do you want to release this?</label>
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
                    {tier === 'PRO' && (
                      <>
                        Set your own price, <span className="mono" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>$1–$5</span>
                        {accessTier === 'PRO' && (
                          <div style={{ marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="number" 
                              min="1" 
                              max="5" 
                              value={proPrice} 
                              onChange={(e) => setProPrice(e.target.value)} 
                              className="field-input"
                              style={{ width: '80px', padding: '6px' }}
                            />
                          </div>
                        )}
                      </>
                    )}
                    {tier === 'PARTNER' && 'You cover the cost — free for every fan'}
                </div>
            </button>
          ))}
        </div>

        <ValidationBanner issues={validationIssues} />

        <button className="btn-publish mono" onClick={handleSubmit} disabled={uploading}>
          {uploading ? '[ PUBLISHING... ]' : '[ publish to vault ]'}
        </button>
        <div className="helper-text">You can edit the price and details anytime after publishing.</div>
      </div>
    </div>
  );
}
