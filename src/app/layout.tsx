import type { Metadata, Viewport } from 'next';
import QueryProvider from '@/lib/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: '꽃길 - 우리 동네 졸업식 일정',
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
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-sm">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
