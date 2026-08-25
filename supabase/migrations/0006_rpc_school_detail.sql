-- 학교 1건을 좌표와 함께 조회한다.
create or replace function school_with_coords(p_id uuid)
returns table (
  id uuid,
  name text,
  school_type text,
  address text,
  lat double precision,
  lng double precision
)
language sql
stable
as $fn$
  select
    s.id, s.name, s.school_type, s.address,
    st_y(s.location::geometry),
    st_x(s.location::geometry)
  from schools s
  where s.id = p_id;
$fn$;

-- 내 관심 학교 목록. 거리는 내 매장 위치 기준으로 계산한다.
create or replace function my_favorite_schools()
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
    st_y(s.location::geometry),
    st_x(s.location::geometry),
    st_distance(s.location, f.location),
    g.graduation_date,
    g.graduation_time,
    g.student_count,
    g.note
  from favorite_schools fs
  join florists f on f.id = fs.florist_id
  join schools s on s.id = fs.school_id
  left join lateral (
    select e.graduation_date, e.graduation_time, e.student_count, e.note
    from graduation_events e
    where e.school_id = s.id
      and e.graduation_date >= current_date
    order by e.graduation_date
    limit 1
  ) g on true
  where f.owner_id = auth.uid()
  order by st_distance(s.location, f.location);
$fn$;
