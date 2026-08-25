import { createClient } from '@/lib/supabase/server';
import { fetchUpcomingEvents } from '@/features/graduation/api';
import EventListItem from '@/features/graduation/EventListItem';
import AppHeader from '@/components/layout/AppHeader';
import BottomNav from '@/components/layout/BottomNav';

export default async function EventsPage() {
  const supabase = createClient();
  const events = await fetchUpcomingEvents(supabase, 100).catch(() => []);

  return (
    <>
      <AppHeader title="졸업식 일정" />

      <main className="flex-1 px-5 py-5">
        <p className="mb-3 text-xs text-gray-400">다가오는 졸업식 {events.length}건</p>

        {events.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-12 text-center text-sm text-gray-400">
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
      </main>

      <BottomNav />
    </>
  );
}
