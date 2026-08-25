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
  const hasEvent = Boolean(school.graduation_date);

  return (
    <Link
      href={`/schools/${school.id}`}
      className={`block rounded-xl border p-4 active:bg-gray-50 ${
        hasEvent ? 'border-pink-200 bg-pink-50/40' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600">
              {school.school_type}
            </span>
            <h3 className="truncate font-semibold">{school.name}</h3>
          </div>
          <p className="mt-1 truncate text-xs text-gray-400">{school.address}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            {formatDistance(school.distance_m)}
          </span>
          <FavoriteButton floristId={floristId} schoolId={school.id} isFavorite={isFavorite} />
        </div>
      </div>

      {hasEvent ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-pink-100 pt-2.5 text-sm">
          <span className="rounded bg-pink-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {formatDday(school.graduation_date!)}
          </span>
          <span className="font-medium">{formatDate(school.graduation_date!)}</span>
          {school.graduation_time && (
            <span className="text-gray-500">{formatTime(school.graduation_time)}</span>
          )}
          {school.student_count && (
            <span className="text-gray-500">졸업생 약 {school.student_count}명</span>
          )}
        </div>
      ) : (
        <p className="mt-3 border-t border-gray-100 pt-2.5 text-xs text-gray-400">
          졸업식 일정 미등록
        </p>
      )}
    </Link>
  );
}
