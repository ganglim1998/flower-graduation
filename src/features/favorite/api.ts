import { createClient } from '@/lib/supabase/client';
import type { NearbySchool } from '@/types';

export async function fetchFavoriteIds(floristId: string): Promise<Set<string>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('favorite_schools')
    .select('school_id')
    .eq('florist_id', floristId);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.school_id));
}

export async function toggleFavorite(
  floristId: string,
  schoolId: string,
  isFavorite: boolean
) {
  const supabase = createClient();

  if (isFavorite) {
    const { error } = await supabase
      .from('favorite_schools')
      .delete()
      .eq('florist_id', floristId)
      .eq('school_id', schoolId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from('favorite_schools')
    .insert({ florist_id: floristId, school_id: schoolId });
  if (error) throw error;
}

export async function fetchFavoriteSchools(): Promise<NearbySchool[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('my_favorite_schools');
  if (error) throw error;
  return data ?? [];
}
