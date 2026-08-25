import { createClient } from '@/lib/supabase/client';

export type MyFlorist = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  lat: number;
  lng: number;
};

export async function fetchMyFlorist(): Promise<MyFlorist | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('my_florist');
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function upsertFlorist(input: {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.rpc('upsert_florist', {
    p_name: input.name,
    p_address: input.address,
    p_lat: input.lat,
    p_lng: input.lng,
    p_phone: input.phone ?? null,
  });
  if (error) throw error;
}
