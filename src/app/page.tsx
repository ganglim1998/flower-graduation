import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { fetchUpcomingEvents } from '@/features/graduation/api';
import EventListItem from '@/features/graduation/EventListItem';
import SchoolSearchBar from '@/features/school/SchoolSearchBar';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';

const QUICK_MENU = [
  { href: '/events', icon: '📅', title: '졸업식 일정', desc: '지역별 일정 확인' },
  { href: '/schools', icon: '📍', title: '주변 학교', desc: '내 매장 반경 조회' },
  { href: '/favorites', icon: '🌷', title: '관심 학교', desc: '저장한 학교 보기' },
  { href: '/settings', icon: '👤', title: '내 매장', desc: '매장 정보 관리' },
];

export default async function HomePage() {
  if (!isSupabaseConfigured) return <SetupNotice />;

  const supabase = createClient();
  const events = await fetchUpcomingEvents(supabase, 5).catch(() => []);

  return (
    <>
      <AppHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FDE7EF] via-[#FCEFF3] to-white px-6 pb-16 pt-9">
          <Petals />

          <h2 className="relative text-[22px] font-bold leading-snug">
            졸업식, 꽃이 필요한 순간
            <br />
            <span className="text-pink-500">근처 판매 장소를</span>
            <br />
            쉽게 찾아보세요!
          </h2>
          <p className="relative mt-3 text-[13px] leading-relaxed text-gray-500">
            전국 졸업식 정보를 한눈에 확인하고
            <br />
            가장 가까운 꽃 판매 장소를 찾아보세요.
          </p>
        </section>

        <div className="-mt-9 px-5">
          <SchoolSearchBar />
        </div>

        <nav className="mt-5 grid grid-cols-4 gap-2 px-5">
          {QUICK_MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex flex-col items-center gap-1 rounded-2xl bg-white px-1 py-3.5 text-center shadow-sm active:bg-gray-50"
            >
              <span className="text-xl leading-none">{m.icon}</span>
              <span className="text-[11px] font-semibold leading-tight">{m.title}</span>
              <span className="text-[9px] leading-tight text-gray-400">{m.desc}</span>
            </Link>
          ))}
        </nav>

        <section className="mt-7 px-5 pb-6">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-base font-bold">다가오는 졸업식</h3>
            {events.length > 0 && (
              <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[11px] font-semibold text-pink-500">
                {events.length}건
              </span>
            )}
            <Link href="/events" className="ml-auto text-xs text-gray-400">
              전체보기 ›
            </Link>
          </div>

          {events.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-gray-400">
              등록된 졸업식 일정이 없습니다.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {events.map((e) => (
                <li key={e.id}>
                  <EventListItem event={e} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <BottomNav />
    </>
  );
}

/** 히어로 배경의 벚꽃잎 장식. */
function Petals() {
  const petals = [
    { left: '8%', top: '12%', size: 10, rotate: 20, opacity: 0.5 },
    { left: '78%', top: '8%', size: 14, rotate: -30, opacity: 0.45 },
    { left: '62%', top: '30%', size: 9, rotate: 60, opacity: 0.4 },
    { left: '88%', top: '52%', size: 12, rotate: 10, opacity: 0.4 },
    { left: '20%', top: '58%', size: 8, rotate: -15, opacity: 0.35 },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {petals.map((p) => (
        <span
          key={`${p.left}-${p.top}`}
          className="absolute block rounded-[50%_0_50%_0] bg-pink-300"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
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
    </main>
  );
}
