'use client';

import Link from 'next/link';
import FavoriteButton from '@/features/favorite/FavoriteButton';
import { formatDistance, formatDate, formatTime, formatDday } from '@/lib/geo';
import type { NearbySchool } from '@/types';

type Props = {
  school: NearbySchool;
  floristId: string;
  isFavorite: boolean;
};

export default function SchoolCard({ school, floristId, isFavorite }: Props) {
  const time = school.graduation_time ? formatTime(school.graduation_time) : null;

  return (
    <Link
      href={`/schools/${school.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm active:bg-gray-50"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pink-50 text-2xl">
        🏫
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            {school.school_type}
          </span>
          <h3 className="truncate text-sm font-bold">{school.name}</h3>
        </div>

        <p className="mt-1 truncate text-xs text-gray-400">{school.address}</p>

        {school.graduation_date ? (
          <p className="mt-1.5 flex items-center gap-2">
            <span className="shrink-0 rounded bg-pink-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {formatDday(school.graduation_date)}
            </span>
            <span className="truncate text-xs text-gray-600">
              {formatDate(school.graduation_date)}
              {time && ` ${time}`}
            </span>
          </p>
        ) : (
          <p className="mt-1.5 text-xs text-gray-300">졸업식 일정 미등록</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-semibold text-pink-500">
          {formatDistance(school.distance_m)}
        </span>
        <FavoriteButton floristId={floristId} schoolId={school.id} isFavorite={isFavorite} />
      </div>
    </Link>
  );
}
