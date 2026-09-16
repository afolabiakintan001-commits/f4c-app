import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim().replace(/^@/, '').toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 });
    }

    // 1. Exact Match Lookups
    const [profileMatch, handleMatch] = await Promise.all([
      supabase.from('profiles').select('id').ilike('username', query).maybeSingle(),
      supabase.from('linked_handles').select('creator_id').ilike('handle', query).maybeSingle(),
    ]);

    // 2. Redirect on Exact Match
    if (profileMatch.data?.id) {
        return NextResponse.json({ type: 'redirect', creator_id: profileMatch.data.id });
    }
    if (handleMatch.data?.creator_id) {
        return NextResponse.json({ type: 'redirect', creator_id: handleMatch.data.creator_id });
    }

    // 3. Partial Match Fallback
    const [partialProfiles, partialHandles] = await Promise.all([
      supabase.from('profiles').select('id, username').ilike('username', `%${query}%`),
      supabase.from('linked_handles').select('creator_id, handle').ilike('handle', `%${query}%`),
    ]);

    return NextResponse.json({
        type: 'list',
        profiles: partialProfiles.data || [],
        handles: partialHandles.data || []
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
