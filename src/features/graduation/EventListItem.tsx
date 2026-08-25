import Link from 'next/link';
import { formatDday, formatTime } from '@/lib/geo';
import type { UpcomingEvent } from './api';

const TYPE_STYLE: Record<string, string> = {
  초: 'bg-amber-100 text-amber-700',
  중: 'bg-sky-100 text-sky-700',
  고: 'bg-violet-100 text-violet-700',
  대: 'bg-emerald-100 text-emerald-700',
};

export default function EventListItem({ event }: { event: UpcomingEvent }) {
  const { school } = event;
  const time = formatTime(event.graduation_time);

  return (
    <Link
      href={`/schools/${school.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm active:bg-gray-50"
    >
      <div
        className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl text-lg font-bold ${
          TYPE_STYLE[school.school_type] ?? 'bg-gray-100 text-gray-600'
        }`}
      >
        {school.school_type}
        <span className="text-[10px] font-medium opacity-70">학교</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{school.name}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          {event.graduation_date.replace(/-/g, '.')}
          {time && ` ${time}`}
        </p>
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-400">
          <span className="text-pink-400">📍</span>
          {school.address}
        </p>
      </div>

      <span className="shrink-0 rounded-full bg-pink-50 px-2.5 py-1 text-[11px] font-bold text-pink-600">
        {formatDday(event.graduation_date)}
      </span>
    </Link>
  );
}
