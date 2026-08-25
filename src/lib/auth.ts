import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { MyFlorist } from '@/features/florist/api';

/** 로그인과 매장 등록을 모두 마친 사용자만 통과시킨다. */
export async function requireFlorist(): Promise<MyFlorist> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data } = await supabase.rpc('my_florist');
  const florist = data?.[0] as MyFlorist | undefined;

  if (!florist) redirect('/onboarding');
  return florist;
}
