'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import KakaoMap from '@/components/map/KakaoMap';
import SchoolCard from './SchoolCard';
import { fetchNearbySchools } from './api';
import { fetchFavoriteIds } from '@/features/favorite/api';
import type { MyFlorist } from '@/features/florist/api';
import type { NearbySchool, SortKey } from '@/types';

const RADIUS_OPTIONS = [1000, 3000, 5000, 10000];

export default function SchoolsView({ florist }: { florist: MyFlorist }) {
  const router = useRouter();
  const [radius, setRadius] = useState(3000);
  const [sort, setSort] = useState<SortKey>('distance');
  const [view, setView] = useState<'list' | 'map'>('list');

  const schools = useQuery({
    queryKey: ['nearby-schools', florist.lat, florist.lng, radius],
    queryFn: () => fetchNearbySchools(florist.lat, florist.lng, radius),
  });

  const favorites = useQuery({
    queryKey: ['favorites', florist.id],
    queryFn: () => fetchFavoriteIds(florist.id),
  });

  const sorted = useMemo(() => sortSchools(schools.data ?? [], sort), [schools.data, sort]);
  const withEvent = sorted.filter((s) => s.graduation_date).length;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 pb-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/settings')}
          className="flex w-full items-center gap-1.5 text-left"
        >
          <span className="text-sm">🌷</span>
          <span className="truncate text-sm font-medium">{florist.name}</span>
          <span className="truncate text-xs text-gray-400">{florist.address}</span>
        </button>

        <div className="mt-3 flex gap-1.5">
          {RADIUS_OPTIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setRadius(m)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                radius === m ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {m / 1000}km
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-3 text-sm">
            <SortTab active={sort === 'distance'} onClick={() => setSort('distance')}>
              거리순
            </SortTab>
            <SortTab active={sort === 'date'} onClick={() => setSort('date')}>
              날짜 임박순
            </SortTab>
          </div>

          <button
            type="button"
            onClick={() => setView(view === 'list' ? 'map' : 'list')}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
          >
            {view === 'list' ? '🗺 지도' : '☰ 목록'}
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 py-4">
        {schools.isPending && <p className="py-16 text-center text-sm text-gray-400">불러오는 중…</p>}

        {schools.isError && (
          <div className="py-16 text-center">
            <p className="text-sm text-gray-500">학교 정보를 불러오지 못했습니다.</p>
            <button
              type="button"
              onClick={() => schools.refetch()}
              className="mt-3 text-sm text-pink-600 underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {schools.isSuccess && sorted.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-400">
            반경 {radius / 1000}km 안에 등록된 학교가 없습니다.
            <br />
            범위를 넓혀보세요.
          </p>
        )}

        {schools.isSuccess && sorted.length > 0 && (
          <>
            <p className="mb-3 text-xs text-gray-400">
              학교 {sorted.length}곳 · 졸업식 일정 등록 {withEvent}곳
            </p>

            {view === 'map' ? (
              <KakaoMap
                center={{ lat: florist.lat, lng: florist.lng }}
                radiusM={radius}
                markers={sorted.map((s) => ({
                  id: s.id,
                  lat: s.lat,
                  lng: s.lng,
                  label: s.name,
                  highlight: Boolean(s.graduation_date),
                }))}
                onMarkerClick={(id) => router.push(`/schools/${id}`)}
                className="h-[60vh] w-full"
              />
            ) : (
              <ul className="space-y-2.5">
                {sorted.map((s) => (
                  <li key={s.id}>
                    <SchoolCard
                      school={s}
                      floristId={florist.id}
                      isFavorite={favorites.data?.has(s.id) ?? false}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}

/** 날짜순은 일정이 등록된 학교를 먼저, 미등록은 거리순으로 뒤에 붙인다. */
function sortSchools(schools: NearbySchool[], sort: SortKey): NearbySchool[] {
  if (sort === 'distance') {
    return [...schools].sort((a, b) => a.distance_m - b.distance_m);
  }

  return [...schools].sort((a, b) => {
    if (a.graduation_date && b.graduation_date) {
      return a.graduation_date.localeCompare(b.graduation_date);
    }
    if (a.graduation_date) return -1;
    if (b.graduation_date) return 1;
    return a.distance_m - b.distance_m;
  });
}

function SortTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'font-semibold text-gray-900' : 'text-gray-400'}
    >
      {children}
    </button>
  );
}
