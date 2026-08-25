'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/schools', label: '지도', icon: '🗺️' },
  { href: '/events', label: '일정', icon: '📅' },
  { href: '/settings', label: '마이페이지', icon: '👤' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 mt-auto grid grid-cols-4 border-t border-gray-100 bg-white">
      {TABS.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 py-2.5 text-[11px] ${
              active ? 'font-semibold text-pink-500' : 'text-gray-400'
            }`}
          >
            <span className={`text-lg leading-none ${active ? '' : 'grayscale'}`}>{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
