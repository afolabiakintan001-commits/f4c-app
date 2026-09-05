export type AccessType = 'MONEY' | 'FREE' | 'FULLY_FREE';

export interface ImageAsset {
  id: string;
  url: string;
  author_handle: string;
  download_count: number;
  access_type: AccessType;
}
