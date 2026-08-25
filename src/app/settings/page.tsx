import { requireFlorist } from '@/lib/auth';
import FloristForm from '@/features/florist/FloristForm';
import SignOutButton from '@/features/florist/SignOutButton';
import BottomNav from '@/components/layout/BottomNav';

export default async function SettingsPage() {
  const florist = await requireFlorist();

  return (
    <>
      <main className="flex-1 px-5 py-6">
        <h1 className="mb-5 text-xl font-bold">내 매장</h1>
        <FloristForm initial={florist} />
        <div className="mt-10 border-t border-gray-100 pt-5">
          <SignOutButton />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
