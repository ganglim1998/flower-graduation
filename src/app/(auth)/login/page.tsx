'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setError('메일 발송에 실패했습니다. 주소를 확인하고 다시 시도해 주세요.');
      setStatus('idle');
      return;
    }
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <main className="flex flex-1 flex-col justify-center px-6 text-center">
        <p className="text-4xl">📬</p>
        <h1 className="mt-4 text-xl font-bold">메일을 확인해 주세요</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          <span className="font-medium text-gray-700">{email}</span> 로 로그인 링크를 보냈습니다.
          <br />
          링크를 누르면 바로 로그인됩니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 text-sm text-gray-400 underline"
        >
          다른 주소로 다시 보내기
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-12">
      <Link href="/" className="text-sm text-gray-400">
        ← 뒤로
      </Link>

      <h1 className="mt-8 text-2xl font-bold">이메일로 시작하기</h1>
      <p className="mt-2 text-sm text-gray-500">
        비밀번호 없이, 메일로 받은 링크만 누르면 됩니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="flower@example.com"
          className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-base outline-none focus:border-pink-500"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-4 w-full rounded-xl bg-pink-600 py-4 text-base font-semibold text-white disabled:bg-gray-300"
        >
          {status === 'sending' ? '보내는 중…' : '로그인 링크 받기'}
        </button>
      </form>
    </main>
  );
}
