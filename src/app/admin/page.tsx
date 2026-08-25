import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminView from '@/features/graduation/AdminView';

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: admin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!admin) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-500">관리자만 접근할 수 있는 페이지입니다.</p>
      </main>
    );
  }

  return <AdminView />;
}
