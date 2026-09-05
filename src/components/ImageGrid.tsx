import Image from 'next/image';
import { ImageAsset, AccessType } from '@/types/image';

const BADGE_STYLES: Record<AccessType, string> = {
  MONEY: 'bg-amber-500 text-white',
  FREE: 'bg-emerald-600/90 text-white',
  FULLY_FREE: 'bg-emerald-600/90 text-white',
};

export function ImageGrid({ assets }: { assets: ImageAsset[] }) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {assets.map((asset) => (
        <div key={asset.id} className="relative group break-inside-avoid rounded-lg overflow-hidden bg-gray-100 aspect-square">
          <Image
            src={asset.url}
            alt={`Image by ${asset.author_handle}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${BADGE_STYLES[asset.access_type]}`}>
              {asset.access_type}
            </div>
            <p className="text-white font-medium">@{asset.author_handle}</p>
            <p className="text-gray-200 text-sm">{asset.download_count} downloads</p>
          </div>
        </div>
      ))}
    </div>
  );
}
