import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import FloristForm from '@/features/florist/FloristForm';

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <main className="flex-1 px-6 py-10">
      <h1 className="text-2xl font-bold">매장 위치를 알려주세요</h1>
      <p className="mt-2 text-sm text-gray-500">
        이 위치를 기준으로 주변 학교의 졸업식 일정을 찾아드립니다.
      </p>
      <div className="mt-8">
        <FloristForm />
      </div>
    </main>
  );
}
