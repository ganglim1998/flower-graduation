import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';
import SchoolSearchBar from '@/features/school/SchoolSearchBar';
import { formatDday, formatTime } from '@/lib/geo';

type SearchRow = {
  id: string;
  name: string;
  address: string;
  school_type: string;
  graduation_events: { graduation_date: string; graduation_time: string | null }[];
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() ?? '';
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data } = q
    ? await supabase
        .from('schools')
        .select('id, name, address, school_type, graduation_events(graduation_date, graduation_time)')
        .or(`name.ilike.%${q}%,address.ilike.%${q}%`)
        .gte('graduation_events.graduation_date', today)
        .order('name')
        .limit(200)
        .returns<SearchRow[]>()
    : { data: [] as SearchRow[] };

  const schools = data ?? [];

  return (
    <>
      <AppHeader title="학교 찾기" />

      <main className="flex-1 px-5 py-5">
        <SchoolSearchBar />

        {q && (
          <p className="mb-3 mt-4 text-xs text-gray-400">
            &lsquo;{q}&rsquo; 검색 결과 {schools.length}건
          </p>
        )}

        {q && schools.length === 0 && (
          <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-gray-400">
            검색 결과가 없습니다.
            <br />
            학교 이름이나 지역명으로 다시 검색해 보세요.
          </p>
        )}

        <ul className="space-y-2.5">
          {schools.map((s) => {
            const next = s.graduation_events
              .slice()
              .sort((a, b) => a.graduation_date.localeCompare(b.graduation_date))[0];

            return (
              <li key={s.id}>
                <Link
                  href={`/schools/${s.id}`}
                  className="block rounded-2xl bg-white p-4 shadow-sm active:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
                      {s.school_type}
                    </span>
                    <span className="truncate text-sm font-semibold">{s.name}</span>
                    {next && (
                      <span className="ml-auto shrink-0 rounded-full bg-pink-50 px-2 py-0.5 text-[11px] font-bold text-pink-600">
                        {formatDday(next.graduation_date)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 truncate text-xs text-gray-400">{s.address}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {next
                      ? `졸업식 ${next.graduation_date.replace(/-/g, '.')}${
                          formatTime(next.graduation_time) ? ` ${formatTime(next.graduation_time)}` : ''
                        }`
                      : '졸업식 일정 미등록'}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>

      <BottomNav />
    </>
  );
}
