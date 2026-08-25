import Link from 'next/link';
import { formatDday, formatTime } from '@/lib/geo';
import type { UpcomingEvent } from './api';

export default function EventListItem({ event }: { event: UpcomingEvent }) {
  const { school } = event;
  const time = formatTime(event.graduation_time);

  return (
    <Link
      href={`/schools/${school.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm active:bg-gray-50"
    >
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
