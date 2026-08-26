'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import NaverMap from '@/components/map/NaverMap';
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
      <header className="sticky top-0 z-10 bg-[#FDF6F7] px-4 pb-2 pt-4">
        <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-pink-100/70">
          <button
            type="button"
            onClick={() => router.push('/settings')}
            className="flex w-full items-center gap-2 px-1.5 py-1 text-left"
          >
            <span className="text-lg leading-none">🌷</span>
            <span className="shrink-0 text-[15px] font-bold">{florist.name}</span>
            <span className="min-w-0 truncate text-xs text-gray-400">{florist.address}</span>
          </button>

          <div className="mt-2.5 grid grid-cols-4 rounded-full p-1 ring-1 ring-pink-100">
            {RADIUS_OPTIONS.map((m, i) => {
              const active = radius === m;
              const divider = !active && radius !== RADIUS_OPTIONS[i - 1] && i > 0;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setRadius(m)}
                  className={`relative flex items-center justify-center gap-1 rounded-full py-2 text-[13px] font-semibold transition-colors ${
                    active ? 'bg-pink-500 text-white' : 'text-gray-500'
                  } ${divider ? 'before:absolute before:left-0 before:h-3.5 before:w-px before:bg-pink-100' : ''}`}
                >
                  <PinIcon active={active} />
                  {m / 1000}km
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 flex items-center gap-1 px-1.5">
            <ClockIcon />
            <SortTab active={sort === 'distance'} onClick={() => setSort('distance')}>
              거리순
            </SortTab>
            <span className="text-pink-100">|</span>
            <SortTab active={sort === 'date'} onClick={() => setSort('date')}>
              날짜 임박순
            </SortTab>

            <button
              type="button"
              onClick={() => setView(view === 'list' ? 'map' : 'list')}
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-pink-100 active:bg-pink-50"
            >
              {view === 'list' ? '🗺 지도 보기' : '☰ 목록 보기'}
              <span className="text-gray-300">›</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-4 pb-5">
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
            <p className="mb-2.5 px-1 text-xs text-gray-400">
              학교 {sorted.length}곳 · 졸업식 일정 등록 {withEvent}곳
            </p>

            {view === 'map' ? (
              <NaverMap
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
      className={`px-1.5 py-1 text-[13px] transition-colors ${
        active ? 'font-bold text-pink-500' : 'text-gray-400'
      }`}
    >
      {children}
    </button>
  );
}

function PinIcon({ active }: { active: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path
        d="M8 1.5c-2.5 0-4.5 2-4.5 4.5 0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5c0-2.5-2-4.5-4.5-4.5Zm0 6.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z"
        fill={active ? '#FFFFFF' : '#D1D5DB'}
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="#F472B6"
      strokeWidth="1.5"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4.5V8l2.2 1.6" strokeLinecap="round" />
    </svg>
  );
}
