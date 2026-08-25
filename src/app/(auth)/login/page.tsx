'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Bouquet from '@/components/ui/Bouquet';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(searchParams.get('error'));

  async function signInWithKakao() {
    setBusy(true);
    setError(null);

    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError('카카오 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setBusy(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col justify-center px-7 py-12">
      <div className="flex justify-center">
        <Bouquet className="h-44 w-44" />
      </div>

      <h1 className="mt-6 text-center text-2xl font-bold">졸업식 꽃 판매 지도</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        로그인하고 더 많은 기능을 이용해보세요
      </p>

      {error && (
        <p className="mt-6 break-words rounded-xl bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={signInWithKakao}
        disabled={busy}
        className="mt-10 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#FEE500] py-4 text-base font-bold text-[#191600] shadow-sm active:brightness-95 disabled:opacity-50"
      >
        <KakaoIcon />
        {busy ? '이동 중…' : '카카오로 로그인'}
      </button>

      <p className="mt-10 text-center text-xs leading-relaxed text-gray-400">
        로그인하면 서비스 이용약관 및 개인정보 처리방침에
        <br />
        동의한 것으로 간주됩니다.
      </p>
    </main>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M9 1.5C4.86 1.5 1.5 4.16 1.5 7.44c0 2.12 1.4 3.98 3.5 5.03l-.89 3.26c-.08.29.25.52.5.35l3.9-2.58c.16.01.32.02.49.02 4.14 0 7.5-2.66 7.5-5.94S13.14 1.5 9 1.5Z" />
    </svg>
  );
}
