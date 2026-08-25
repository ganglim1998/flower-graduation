import { requireFlorist } from '@/lib/auth';
import SchoolDetailView from '@/features/school/SchoolDetailView';

export default async function SchoolDetailPage({ params }: { params: { id: string } }) {
  const florist = await requireFlorist();
  return <SchoolDetailView schoolId={params.id} florist={florist} />;
}
