'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/schools', label: '학교 찾기', icon: '🏫' },
  { href: '/favorites', label: '관심 학교', icon: '❤️' },
  { href: '/settings', label: '내 매장', icon: '🌷' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 mt-auto grid grid-cols-3 border-t border-gray-200 bg-white">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
              active ? 'text-pink-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
