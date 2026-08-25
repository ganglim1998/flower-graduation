import type { Metadata, Viewport } from 'next';
import QueryProvider from '@/lib/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: '꽃길: 졸업식 꽃 판매 지도',
  description: '내 꽃집 주변 학교의 졸업식 일정을 거리순, 날짜순으로 확인하세요.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <QueryProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#FDF6F7] shadow-sm">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
