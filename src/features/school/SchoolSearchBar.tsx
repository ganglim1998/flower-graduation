'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SchoolSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function submit() {
    const q = query.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pl-4 shadow-lg shadow-pink-900/5">
      <PinIcon />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        placeholder="학교명 또는 지역명을 입력하세요"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      <button
        type="button"
        onClick={submit}
        aria-label="검색"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-white active:bg-pink-600"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="9" r="6" />
          <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="#F472B6" aria-hidden="true" className="shrink-0">
      <path d="M8 1.5c-2.5 0-4.5 2-4.5 4.5 0 3.2 4.5 8.5 4.5 8.5s4.5-5.3 4.5-8.5c0-2.5-2-4.5-4.5-4.5Zm0 6.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" />
    </svg>
  );
}
