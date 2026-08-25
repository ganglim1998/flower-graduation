import { requireFlorist } from '@/lib/auth';
import SchoolsView from '@/features/school/SchoolsView';
import BottomNav from '@/components/layout/BottomNav';

export default async function SchoolsPage() {
  const florist = await requireFlorist();

  return (
    <>
      <SchoolsView florist={florist} />
      <BottomNav />
    </>
  );
}
