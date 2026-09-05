// src/types/database.ts

export type AccessType = 'MONEY' | 'FREE' | 'FULLY_FREE';

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

export interface SocialHandle {
  id: string;
  profile_id: string;
  platform: string;
  handle: string;
  created_at: string;
}

export interface ImageAsset {
  id: string;
  profile_id: string;
  url: string;
  access_type: AccessType;
  created_at: string;
}

export interface PointTransaction {
  id: string;
  profile_id: string;
  amount: number;
  description: string | null;
  created_at: string;
}

// Helper types for joins
export interface ProfileWithHandles extends Profile {
  social_handles: SocialHandle[];
}

export interface ProfileWithAssets extends Profile {
  image_assets: ImageAsset[];
}
