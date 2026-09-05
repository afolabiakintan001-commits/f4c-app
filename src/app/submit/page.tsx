'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';

export default function SubmitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [accessType, setAccessType] = useState<'FREE' | 'FULLY_FREE' | 'MONEY'>('FREE');
  const [price, setPrice] = useState('0.00');
  const [tags, setTags] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('images')
        .insert({
          user_id: user.id,
          title,
          category,
          file_type: fileExt?.toUpperCase() || 'UNKNOWN',
          tags: tags.split(',').map(t => t.trim()),
          preview_url: publicUrl,
          master_file_url: publicUrl,
          access_type: accessType,
          price_gbp: parseFloat(price)
        });

      if (dbError) throw dbError;

      alert('[ SUCCESS: ASSET_PUBLISHED_TO_VAULT ]');
    } catch (err: any) {
      alert(`[ ERROR: ${err.message} ]`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12 mono">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-[14px] h-[14px] bg-black" />
        <h1 className="text-[14px] tracking-tight">[ SUBMIT MASTER FILE TO VAULT ]</h1>
      </div>
      <h2 className="text-[48px] font-bold mb-2">Host original assets.</h2>
      <p className="text-[#71716b] mb-12">Untouched by platform compression or watermarks. Verified creators only.</p>

      {/* Two-Column Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left Column: Dropzone */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border border-[#dcdcd7] bg-[#fafaf9] h-[500px] flex items-center justify-center cursor-pointer hover:border-black transition-colors"
          >
            {file ? (
              <div className="text-center p-4">
                <p className="text-[12px] font-bold">[ {file.name} ]</p>
                <p className="text-[10px] text-[#71716b]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <p className="text-[12px] text-[#71716b]">[ DRAG_OR_CLICK_TO_ATTACH ]</p>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="space-y-8">
          <div>
            <label className="text-[11px] text-[#71716b]">ASSET TITLE</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border-b border-[#dcdcd7] py-2 outline-none text-[14px]" placeholder="35mm Film Grain Scan Vol. 1" />
          </div>

          <div>
            <label className="text-[11px] text-[#71716b]">CATEGORY</label>
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-b border-[#dcdcd7] py-2 outline-none text-[14px] bg-transparent">
              <option value="">SELECT_CATEGORY</option>
              {['Anime edits', 'Car stills', 'Graphic textures', '4K wallpapers', '3D renders', 'Film frames'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-[#71716b]">ACCESS TIER</label>
            <div className="flex gap-4 mt-2">
              {(['FREE', 'FULLY_FREE', 'MONEY'] as const).map(tier => (
                <button type="button" key={tier} onClick={() => setAccessType(tier)} className={`px-3 py-1 border text-[11px] ${accessType === tier ? 'bg-black text-white' : ''}`}>
                  {tier}
                </button>
              ))}
            </div>
            {accessType === 'MONEY' && <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border-b border-[#dcdcd7] py-2 outline-none text-[14px] mt-2" placeholder="Price (£)" />}
          </div>

          <div>
            <label className="text-[11px] text-[#71716b]">TAGS</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border-b border-[#dcdcd7] py-2 outline-none text-[14px]" placeholder="grain, 4k, overlay, png" />
          </div>

          <button type="submit" disabled={loading} className="bg-black text-white px-6 py-3 text-[12px] font-bold w-full">
            {loading ? '[ PUBLISHING... ]' : '[ PUBLISH TO VAULT ]'}
          </button>
        </div>
      </form>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => { setIsAuthOpen(false); handleSubmit(new Event('submit') as any); }} />
    </div>
  );
}
