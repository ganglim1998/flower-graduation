-- 좌표를 geography 로 변환해 꽃집을 저장한다. 사용자당 1개 매장.
create or replace function upsert_florist(
  p_name text,
  p_address text,
  p_lat double precision,
  p_lng double precision,
  p_phone text default null
)
returns florists
language plpgsql
security invoker
as $fn$
declare
  result florists;
begin
  insert into florists (owner_id, name, address, location, phone)
  values (
    auth.uid(), p_name, p_address,
    st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography,
    p_phone
  )
  on conflict (owner_id) do update
    set name = excluded.name,
        address = excluded.address,
        location = excluded.location,
        phone = excluded.phone
  returning * into result;

  return result;
end;
$fn$;

-- 내 매장 정보를 좌표와 함께 조회한다.
create or replace function my_florist()
returns table (
  id uuid,
  name text,
  address text,
  phone text,
  lat double precision,
  lng double precision
)
language sql
stable
as $fn$
  select
    f.id, f.name, f.address, f.phone,
    st_y(f.location::geometry),
    st_x(f.location::geometry)
  from florists f
  where f.owner_id = auth.uid();
$fn$;
