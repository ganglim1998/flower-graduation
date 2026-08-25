'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import SchoolCard from '@/features/school/SchoolCard';
import { fetchFavoriteSchools, fetchFavoriteIds } from './api';
import type { MyFlorist } from '@/features/florist/api';

export default function FavoritesView({ florist }: { florist: MyFlorist }) {
  const schools = useQuery({
    queryKey: ['favorite-schools', florist.id],
    queryFn: fetchFavoriteSchools,
  });

  const favorites = useQuery({
    queryKey: ['favorites', florist.id],
    queryFn: () => fetchFavoriteIds(florist.id),
  });

  return (
    <main className="flex-1 px-4 py-6">
      <h1 className="mb-4 text-xl font-bold">내 관심 학교</h1>

      {schools.isPending && <p className="py-16 text-center text-sm text-gray-400">불러오는 중…</p>}

      {schools.isError && (
        <p className="py-16 text-center text-sm text-gray-500">목록을 불러오지 못했습니다.</p>
      )}

      {schools.isSuccess && schools.data.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-sm text-gray-400">아직 등록한 관심 학교가 없습니다.</p>
          <Link href="/schools" className="mt-3 inline-block text-sm text-pink-600 underline">
            주변 학교 둘러보기
          </Link>
        </div>
      )}

      {schools.isSuccess && schools.data.length > 0 && (
        <ul className="space-y-2.5">
          {schools.data.map((s) => (
            <li key={s.id}>
              <SchoolCard
                school={s}
                floristId={florist.id}
                isFavorite={favorites.data?.has(s.id) ?? true}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
