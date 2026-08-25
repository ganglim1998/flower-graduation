-- 반경 내 학교 + 가장 임박한 졸업식 1건을 함께 반환한다.
-- 정렬(거리순/날짜순)은 결과 수가 적으므로 클라이언트에서 처리한다.
create or replace function nearby_schools(
  p_lat double precision,
  p_lng double precision,
  p_radius_m integer
)
returns table (
  id uuid,
  name text,
  school_type text,
  address text,
  lat double precision,
  lng double precision,
  distance_m double precision,
  graduation_date date,
  graduation_time time,
  student_count int,
  note text
)
language sql
stable
as $fn$
  select
    s.id,
    s.name,
    s.school_type,
    s.address,
    st_y(s.location::geometry) as lat,
    st_x(s.location::geometry) as lng,
    st_distance(
      s.location,
      st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography
    ) as distance_m,
    g.graduation_date,
    g.graduation_time,
    g.student_count,
    g.note
  from schools s
  left join lateral (
    select e.graduation_date, e.graduation_time, e.student_count, e.note
    from graduation_events e
    where e.school_id = s.id
      and e.graduation_date >= current_date
    order by e.graduation_date
    limit 1
  ) g on true
  where st_dwithin(
    s.location,
    st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography,
    p_radius_m
  )
  order by distance_m;
$fn$;
