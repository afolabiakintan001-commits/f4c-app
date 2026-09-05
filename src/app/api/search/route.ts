import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface ProfileResult {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

export interface HandleResult {
  id: string;
  handle: string;
  platform: string;
  profiles: { username: string | null } | null;
}

export interface SearchApiResponse {
  profiles: ProfileResult[];
  handles: HandleResult[];
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().replace(/^@/, '');

    if (!query || query.length < 2) {
      return NextResponse.json<SearchApiResponse>({
        profiles: [],
        handles: [],
      });
    }

    // Execute parallel searches on usernames and multi-platform social handles
    const [profilesResult, handlesResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .ilike('username', `%${query}%`)
        .limit(5),
      supabase
        .from('social_handles')
        .select('id, handle, platform, profiles(username)')
        .ilike('handle', `%${query}%`)
        .limit(5),
    ]);

    if (profilesResult.error) throw profilesResult.error;
    if (handlesResult.error) throw handlesResult.error;

    return NextResponse.json<SearchApiResponse>({
      profiles: (profilesResult.data as unknown as ProfileResult[]) || [],
      handles: (handlesResult.data as unknown as HandleResult[]) || [],
    });
  } catch (error: any) {
    console.error('Search API Route Error:', error);
    return NextResponse.json<SearchApiResponse>(
      { profiles: [], handles: [], error: 'Failed to process search query' },
      { status: 500 }
    );
  }
}
