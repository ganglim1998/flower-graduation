'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <main className="flex flex-1 flex-col px-6 py-12">
      <Link href="/" className="text-sm text-gray-400">
        ← 뒤로
      </Link>

      <div className="flex flex-1 flex-col justify-center">
        <h1 className="text-2xl font-bold">카카오로 시작하기</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          별도 회원가입 없이 카카오 계정으로 바로 이용할 수 있습니다.
        </p>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={signInWithKakao}
          disabled={busy}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-4 text-base font-semibold text-[#191600] disabled:opacity-50"
        >
          <KakaoIcon />
          {busy ? '이동 중…' : '카카오 로그인'}
        </button>
      </div>
    </main>
  );
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <path d="M9 1.5C4.86 1.5 1.5 4.16 1.5 7.44c0 2.12 1.4 3.98 3.5 5.03l-.89 3.26c-.08.29.25.52.5.35l3.9-2.58c.16.01.32.02.49.02 4.14 0 7.5-2.66 7.5-5.94S13.14 1.5 9 1.5Z" />
    </svg>
  );
}
