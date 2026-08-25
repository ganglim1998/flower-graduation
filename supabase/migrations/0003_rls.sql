alter table florists enable row level security;
alter table schools enable row level security;
alter table graduation_events enable row level security;
alter table favorite_schools enable row level security;
alter table admins enable row level security;

create function is_admin() returns boolean
language sql stable security definer set search_path = public as $fn$
  select exists (select 1 from admins where user_id = auth.uid());
$fn$;

-- 꽃집: 본인 매장만 읽고 쓴다.
create policy "own florist" on florists
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- 학교/졸업식: 로그인 사용자는 모두 조회, 수정은 관리자만.
create policy "read schools" on schools
  for select to authenticated using (true);
create policy "admin writes schools" on schools
  for all to authenticated using (is_admin()) with check (is_admin());

create policy "read events" on graduation_events
  for select to authenticated using (true);
create policy "admin writes events" on graduation_events
  for all to authenticated using (is_admin()) with check (is_admin());

-- 관심 학교: 본인 매장에 속한 것만.
create policy "own favorites" on favorite_schools
  for all to authenticated
  using (florist_id in (select id from florists where owner_id = auth.uid()))
  with check (florist_id in (select id from florists where owner_id = auth.uid()));

-- 관리자 여부는 본인 것만 확인 가능.
create policy "read own admin row" on admins
  for select to authenticated using (user_id = auth.uid());
