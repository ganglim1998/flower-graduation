import type { SupabaseClient } from '@supabase/supabase-js';

export type UpcomingEvent = {
  id: string;
  graduation_date: string;
  graduation_time: string | null;
  student_count: number | null;
  school: { id: string; name: string; address: string; school_type: string };
};

type Row = Omit<UpcomingEvent, 'school'> & {
  schools: { id: string; name: string; address: string; school_type: string } | null;
};

/** 오늘 이후의 졸업식을 임박순으로 가져온다. 학교/졸업식은 공개 조회가 허용되어 있다. */
export async function fetchUpcomingEvents(
  supabase: SupabaseClient,
  limit = 20
): Promise<UpcomingEvent[]> {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('graduation_events')
    .select('id, graduation_date, graduation_time, student_count, schools(id, name, address, school_type)')
    .gte('graduation_date', today)
    .order('graduation_date')
    .limit(limit)
    .returns<Row[]>();

  if (error) throw error;

  return (data ?? [])
    .filter((r): r is Row & { schools: NonNullable<Row['schools']> } => r.schools !== null)
    .map(({ schools, ...rest }) => ({ ...rest, school: schools }));
}
