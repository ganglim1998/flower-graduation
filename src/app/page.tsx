import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export default async function LandingPage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/schools');

  return (
    <main className="flex flex-1 flex-col justify-between px-6 py-14">
      <div>
        <p className="text-sm font-medium text-pink-600">꽃집 사장님을 위한</p>
        <h1 className="mt-3 text-3xl font-bold leading-snug">
          우리 가게 주변
          <br />
          졸업식이 언제인지
          <br />
          한눈에.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-gray-500">
          매장 위치만 등록하면 반경 내 학교의 졸업식 날짜를 거리순, 날짜순으로 정리해 드립니다.
        </p>

        <ul className="mt-10 space-y-3 text-sm text-gray-700">
          <li className="flex gap-2.5">
            <span>📍</span> 주소 검색으로 매장 위치 등록
          </li>
          <li className="flex gap-2.5">
            <span>🎓</span> 반경 1~10km 학교 졸업식 일정 확인
          </li>
          <li className="flex gap-2.5">
            <span>❤️</span> 관심 학교만 모아보기
          </li>
        </ul>
      </div>

      <Link
        href="/login"
        className="mt-12 block rounded-xl bg-pink-600 py-4 text-center text-base font-semibold text-white active:bg-pink-700"
      >
        시작하기
      </Link>
    </main>
  );
}

/** .env.local 이 비어 있을 때만 보이는 설정 안내. */
function SetupNotice() {
  return (
    <main className="flex-1 px-6 py-14">
      <h1 className="text-xl font-bold">설정이 필요합니다</h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        <code className="rounded bg-gray-100 px-1">.env.local</code> 에 Supabase URL 과 anon 키를
        입력한 뒤 개발 서버를 다시 시작해 주세요.
      </p>
      <ol className="mt-6 space-y-2 text-sm text-gray-700">
        <li>1. Supabase 프로젝트 &gt; Settings &gt; API 에서 값 복사</li>
        <li>
          2. <code className="rounded bg-gray-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
          <code className="rounded bg-gray-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> 채우기
        </li>
        <li>3. supabase/migrations 의 SQL 을 순서대로 실행</li>
        <li>4. 개발 서버 재시작</li>
      </ol>
    </main>
  );
}
