'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

type School = { id: string; name: string; address: string };
type EventRow = {
  id: string;
  graduation_date: string;
  graduation_time: string | null;
  student_count: number | null;
  note: string | null;
};

const EMPTY = { graduation_date: '', graduation_time: '', student_count: '', note: '' };

export default function AdminView() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [school, setSchool] = useState<School | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const schools = useQuery({
    queryKey: ['admin-schools', query],
    queryFn: async (): Promise<School[]> => {
      const { data, error } = await createClient()
        .from('schools')
        .select('id, name, address')
        .ilike('name', `%${query}%`)
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: query.trim().length > 0,
  });

  const events = useQuery({
    queryKey: ['admin-events', school?.id],
    queryFn: async (): Promise<EventRow[]> => {
      const { data, error } = await createClient()
        .from('graduation_events')
        .select('id, graduation_date, graduation_time, student_count, note')
        .eq('school_id', school!.id)
        .order('graduation_date');
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(school),
  });

  const save = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const payload = {
        school_id: school!.id,
        graduation_date: form.graduation_date,
        graduation_time: form.graduation_time || null,
        student_count: form.student_count ? Number(form.student_count) : null,
        note: form.note || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = editingId
        ? await supabase.from('graduation_events').update(payload).eq('id', editingId)
        : await supabase.from('graduation_events').insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      setForm(EMPTY);
      setEditingId(null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['admin-events', school?.id] });
    },
    onError: () => setError('저장에 실패했습니다. 관리자 권한과 입력값을 확인하세요.'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await createClient().from('graduation_events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-events', school?.id] }),
  });

  return (
    <main className="flex-1 px-4 py-6">
      <h1 className="text-lg font-bold">졸업식 일정 관리</h1>

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSchool(null);
        }}
        placeholder="학교 이름 검색"
        className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      {!school && schools.data && schools.data.length > 0 && (
        <ul className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-200">
          {schools.data.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setSchool(s);
                  setQuery(s.name);
                }}
                className="w-full px-3 py-2 text-left text-sm"
              >
                {s.name}
                <span className="ml-2 text-xs text-gray-400">{s.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {school && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold">{school.name}</h2>

          <ul className="mt-2 space-y-1.5">
            {events.data?.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <span>
                  {e.graduation_date} {e.graduation_time?.slice(0, 5) ?? ''}{' '}
                  {e.student_count ? `· ${e.student_count}명` : ''}
                </span>
                <span className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(e.id);
                      setForm({
                        graduation_date: e.graduation_date,
                        graduation_time: e.graduation_time?.slice(0, 5) ?? '',
                        student_count: e.student_count?.toString() ?? '',
                        note: e.note ?? '',
                      });
                    }}
                    className="text-blue-600"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => remove.mutate(e.id)}
                    className="text-red-600"
                  >
                    삭제
                  </button>
                </span>
              </li>
            ))}
            {events.data?.length === 0 && (
              <li className="py-2 text-sm text-gray-400">등록된 일정이 없습니다.</li>
            )}
          </ul>

          <div className="mt-5 space-y-2 rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">
              {editingId ? '일정 수정' : '새 일정 추가'}
            </p>
            <input
              type="date"
              value={form.graduation_date}
              onChange={(e) => setForm({ ...form, graduation_date: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
            <input
              type="time"
              value={form.graduation_time}
              onChange={(e) => setForm({ ...form, graduation_time: e.target.value })}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              value={form.student_count}
              onChange={(e) => setForm({ ...form, student_count: e.target.value })}
              placeholder="졸업생 수 (선택)"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="비고 (선택)"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
            />

            {error && <p className="text-xs text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => save.mutate()}
                disabled={!form.graduation_date || save.isPending}
                className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white disabled:bg-gray-300"
              >
                {editingId ? '수정 저장' : '추가'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY);
                  }}
                  className="text-sm text-gray-500"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
