import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** 매직링크 코드를 세션으로 교환한 뒤, 매장 등록 여부에 따라 분기한다. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=invalid_link`);
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=expired_link`);
  }

  const { data: florist } = await supabase.from('florists').select('id').maybeSingle();
  return NextResponse.redirect(`${origin}${florist ? '/schools' : '/onboarding'}`);
}
