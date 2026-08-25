import { requireFlorist } from '@/lib/auth';
import FavoritesView from '@/features/favorite/FavoritesView';
import BottomNav from '@/components/layout/BottomNav';

export default async function FavoritesPage() {
  const florist = await requireFlorist();

  return (
    <>
      <FavoritesView florist={florist} />
      <BottomNav />
    </>
  );
}
