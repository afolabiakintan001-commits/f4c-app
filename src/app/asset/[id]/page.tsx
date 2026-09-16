'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AssetDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('images')
        .select('*, profiles(*)')
        .eq('id', id)
        .single();
      setAsset(data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);

    try {
      // 1. Check access
      const { data: { user } } = await supabase.auth.getUser();
      if (asset.access_type === 'MONEY' && !user) {
        alert('Please log in to purchase this asset.');
        return;
      }

      // 2. Generate signed URL
      const { data, error } = await supabase.storage
        .from('master-assets')
        .createSignedUrl(asset.master_file_path, 60);

      if (error) throw error;

      // 3. Trigger download
      window.open(data.signedUrl, '_blank');

      // 4. Update download count
      await supabase
        .from('images')
        .update({ download_count: (asset.download_count || 0) + 1 })
        .eq('id', id);

      setAsset((prev: any) => ({ ...prev, download_count: (prev.download_count || 0) + 1 }));
    } catch (err) {
      console.error(err);
      alert('Failed to generate download link.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <main className="min-h-screen p-12 mono">[ loading vault item... ]</main>;
  if (!asset) return <main className="min-h-screen p-12 mono">[ asset not found ]</main>;

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Preview */}
        <div className="border border-[#dcdcd7] p-4 bg-white" style={{borderRadius: '2px'}}>
          <img src={asset.preview_url} alt={asset.title} className="w-full h-auto" />
        </div>

        {/* Right Column: Metadata Panel */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
             <h1 className="font-['Space_Grotesk'] text-[32px] font-bold text-[#0a0a0a]">{asset.title}</h1>
             <span className="font-['IBM_Plex_Mono'] text-[13px] text-[#71716b] border border-[#dcdcd7] px-2 py-1" style={{borderRadius: '2px'}}>
               [ F-{asset.id.slice(0, 3).toUpperCase()} ]
             </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between border-b border-[#dcdcd7] pb-2">
              <span className="font-['Space_Grotesk'] text-[#71716b]">File name</span>
              <span className="font-['IBM_Plex_Mono'] text-[#0a0a0a]">{asset.title}.{asset.file_type || 'tiff'}</span>
            </div>
            <div className="flex justify-between border-b border-[#dcdcd7] pb-2">
              <span className="font-['Space_Grotesk'] text-[#71716b]">Dimensions</span>
              <span className="font-['IBM_Plex_Mono'] text-[#0a0a0a]">{asset.resolution || '4096x2160'}</span>
            </div>
            <div className="flex justify-between border-b border-[#dcdcd7] pb-2">
              <span className="font-['Space_Grotesk'] text-[#71716b]">Downloads</span>
              <span className="font-['IBM_Plex_Mono'] text-[#0a0a0a]">[ {asset.download_count || 0} ]</span>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full mt-4 px-[18px] py-[11px] bg-[#0a0a0a] text-white font-['IBM_Plex_Mono'] text-[13.5px] font-medium tracking-wide"
            style={{ borderRadius: '2px' }}
          >
            {downloading ? '[ generating... ]' : '[ download_master_file ]'}
          </button>
        </div>
      </div>
    </main>
  );
}
