import { createClient } from '@/lib/supabase/client';
import type { NearbySchool } from '@/types';

export async function fetchNearbySchools(
  lat: number,
  lng: number,
  radiusM: number
): Promise<NearbySchool[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('nearby_schools', {
    p_lat: lat,
    p_lng: lng,
    p_radius_m: radiusM,
  });
  if (error) throw error;
  return data ?? [];
}

export type SchoolDetail = {
  id: string;
  name: string;
  school_type: string;
  address: string;
  lat: number;
  lng: number;
  events: {
    id: string;
    graduation_date: string;
    graduation_time: string | null;
    student_count: number | null;
    note: string | null;
  }[];
};

export async function fetchSchoolDetail(id: string): Promise<SchoolDetail | null> {
  const supabase = createClient();

  const [school, events] = await Promise.all([
    supabase.rpc('school_with_coords', { p_id: id }),
    supabase
      .from('graduation_events')
      .select('id, graduation_date, graduation_time, student_count, note')
      .eq('school_id', id)
      .order('graduation_date'),
  ]);

  if (school.error) throw school.error;
  if (events.error) throw events.error;

  const row = school.data?.[0];
  if (!row) return null;

  return { ...row, events: events.data ?? [] };
}
