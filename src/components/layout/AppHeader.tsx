import Link from 'next/link';

export default function AppHeader({ title = '졸업식 꽃 판매 지도' }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3.5">
      <GraduationCapIcon />
      <h1 className="flex-1 text-[15px] font-bold">{title}</h1>
      <Link href="/settings" aria-label="내 정보" className="p-1 text-gray-500">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
        </svg>
      </Link>
    </header>
  );
}

function GraduationCapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4 2 8.5 12 13l10-4.5L12 4Z" fill="#1F2937" />
      <path d="M6 10.5v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" fill="#F472B6" />
      <path d="M21 9v5" stroke="#1F2937" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
