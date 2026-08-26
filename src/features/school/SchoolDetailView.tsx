'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import NaverMap from '@/components/map/NaverMap';
import FavoriteButton from '@/features/favorite/FavoriteButton';
import { fetchSchoolDetail } from './api';
import { fetchFavoriteIds } from '@/features/favorite/api';
import { formatDistance, formatDate, formatTime, formatDday, haversine } from '@/lib/geo';
import type { MyFlorist } from '@/features/florist/api';

export default function SchoolDetailView({
  schoolId,
  florist,
}: {
  schoolId: string;
  florist: MyFlorist;
}) {
  const router = useRouter();

  const school = useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => fetchSchoolDetail(schoolId),
  });

  const favorites = useQuery({
    queryKey: ['favorites', florist.id],
    queryFn: () => fetchFavoriteIds(florist.id),
  });

  if (school.isPending) {
    return <p className="py-24 text-center text-sm text-gray-400">불러오는 중…</p>;
  }

  if (school.isError || !school.data) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-gray-500">학교 정보를 불러오지 못했습니다.</p>
        <button type="button" onClick={() => router.back()} className="mt-3 text-sm text-pink-600 underline">
          돌아가기
        </button>
      </div>
    );
  }

  const s = school.data;
  const distance = haversine(florist, s);
  const upcoming = s.events.filter((e) => e.graduation_date >= new Date().toISOString().slice(0, 10));

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => router.back()} className="text-sm text-gray-400">
          ← 뒤로
        </button>
        <FavoriteButton
          floristId={florist.id}
          schoolId={s.id}
          isFavorite={favorites.data?.has(s.id) ?? false}
          size="lg"
        />
      </div>

      <div className="px-5">
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
          {s.school_type}
        </span>
        <h1 className="mt-2 text-2xl font-bold">{s.name}</h1>
        <p className="mt-1.5 text-sm text-gray-500">{s.address}</p>
        <p className="mt-1 text-sm font-medium text-pink-600">
          내 매장에서 {formatDistance(distance)}
        </p>

        <div className="mt-5">
          <NaverMap
            center={{ lat: s.lat, lng: s.lng }}
            markers={[{ id: s.id, lat: s.lat, lng: s.lng, label: s.name, highlight: true }]}
            className="h-44 w-full"
          />
        </div>

        <h2 className="mt-8 text-sm font-semibold text-gray-700">졸업식 일정</h2>

        {upcoming.length === 0 ? (
          <p className="mt-3 rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">
            아직 등록된 일정이 없습니다.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5 pb-10">
            {upcoming.map((e) => (
              <li key={e.id} className="rounded-xl border border-pink-200 bg-pink-50/40 p-4">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-pink-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {formatDday(e.graduation_date)}
                  </span>
                  <span className="font-semibold">{formatDate(e.graduation_date)}</span>
                  {e.graduation_time && (
                    <span className="text-sm text-gray-500">{formatTime(e.graduation_time)}</span>
                  )}
                </div>
                {e.student_count && (
                  <p className="mt-2 text-sm text-gray-600">졸업생 약 {e.student_count}명</p>
                )}
                {e.note && <p className="mt-1 text-sm text-gray-500">{e.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
