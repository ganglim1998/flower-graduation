'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NaverMap from '@/components/map/NaverMap';
import { upsertFlorist, type MyFlorist } from './api';
import type { AddressResult } from '@/types';

type Props = { initial?: MyFlorist | null };

export default function FloristForm({ initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AddressResult[] | null>(null);
  const [picked, setPicked] = useState<AddressResult | null>(
    initial ? { address: initial.address, lat: initial.lat, lng: initial.lng } : null
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function searchAddress() {
    if (!query.trim()) return;
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results);
      if (data.results.length === 0) {
        setError('검색 결과가 없습니다. 도로명 주소나 동 이름으로 다시 시도해 보세요.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '주소 검색 중 문제가 발생했습니다.');
    } finally {
      setBusy(false);
    }
  }

  function useCurrentLocation() {
    setError(null);
    if (!navigator.geolocation) {
      setError('이 브라우저는 현재 위치를 지원하지 않습니다. 주소로 검색해 주세요.');
      return;
    }

    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(`/api/geocode?lat=${coords.latitude}&lng=${coords.longitude}`);
          const data = await res.json();
          setPicked(data.results[0]);
          setResults(null);
        } catch {
          setPicked({
            address: `현재 위치 (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`,
            lat: coords.latitude,
            lng: coords.longitude,
          });
        } finally {
          setBusy(false);
        }
      },
      (err) => {
        setBusy(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? '위치 권한이 거부되었습니다. 주소로 검색해 주세요.'
            : '현재 위치를 가져오지 못했습니다. 주소로 검색해 주세요.'
        );
      },
      { timeout: 10000 }
    );
  }

  async function save() {
    if (!picked || !name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await upsertFlorist({
        name: name.trim(),
        address: picked.address,
        lat: picked.lat,
        lng: picked.lng,
        phone: phone.trim() || undefined,
      });
      router.push('/schools');
      router.refresh();
    } catch {
      setError('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="매장 이름">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="○○플라워"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-pink-500"
        />
      </Field>

      <Field label="매장 위치">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchAddress()}
          placeholder="예: 서울 강북구 오현로"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-pink-500"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={searchAddress}
            disabled={busy}
            className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white disabled:bg-gray-300"
          >
            주소 검색
          </button>
          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={busy}
            className="flex-1 rounded-xl border border-pink-200 py-3 text-sm font-medium text-pink-600 disabled:text-gray-300"
          >
            📍 현재 위치
          </button>
        </div>
      </Field>

      {results && results.length > 0 && (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {results.map((r) => (
            <li key={`${r.lat}-${r.lng}-${r.address}`}>
              <button
                type="button"
                onClick={() => {
                  setPicked(r);
                  setResults(null);
                }}
                className="w-full px-4 py-3 text-left text-sm active:bg-gray-50"
              >
                {r.address}
                {r.placeName && <span className="ml-2 text-xs text-gray-400">{r.placeName}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {picked && (
        <div>
          <p className="mb-2 text-sm font-medium">{picked.address}</p>
          <NaverMap center={picked} className="h-48 w-full" />
        </div>
      )}

      <Field label="연락처 (선택)">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="02-0000-0000"
          inputMode="tel"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-pink-500"
        />
      </Field>

      {!picked && (
        <p className="text-xs text-gray-400">
          주소를 검색해 목록에서 선택하면 저장할 수 있습니다.
        </p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={!picked || !name.trim() || busy}
        className="w-full rounded-xl bg-pink-600 py-4 text-base font-semibold text-white disabled:bg-gray-300"
      >
        {busy ? '저장 중…' : '저장하고 주변 학교 보기'}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
