-- 홈 화면은 로그인 전에도 졸업식 정보를 보여준다.
-- 학교/졸업식은 공개 정보이므로 anon 에게도 조회를 허용한다.
-- (꽃집, 관심 학교는 기존 정책 그대로 본인만 접근)
drop policy if exists "read schools" on schools;
create policy "read schools" on schools
  for select to anon, authenticated using (true);

drop policy if exists "read events" on graduation_events;
create policy "read events" on graduation_events
  for select to anon, authenticated using (true);
