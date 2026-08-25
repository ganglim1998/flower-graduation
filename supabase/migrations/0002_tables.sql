-- 꽃집 (사업자). 사용자 1명당 1개 매장을 전제로 한다.
create table florists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users on delete cascade,
  name text not null,
  address text not null,
  location geography(point, 4326) not null,
  phone text,
  created_at timestamptz not null default now()
);

-- 학교
create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  school_type text not null check (school_type in ('초', '중', '고', '대')),
  address text not null,
  location geography(point, 4326) not null,
  created_at timestamptz not null default now()
);
create index schools_location_idx on schools using gist (location);

-- 졸업식 일정
create table graduation_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools on delete cascade,
  graduation_date date not null,
  graduation_time time,
  student_count int,
  note text,
  updated_at timestamptz not null default now()
);
create index graduation_events_school_date_idx
  on graduation_events (school_id, graduation_date);

-- 관심 학교 등록
create table favorite_schools (
  id uuid primary key default gen_random_uuid(),
  florist_id uuid not null references florists on delete cascade,
  school_id uuid not null references schools on delete cascade,
  created_at timestamptz not null default now(),
  unique (florist_id, school_id)
);

-- 관리자 (졸업식 일정 수기 입력 권한). 최초 1명은 SQL로 직접 insert 한다.
create table admins (
  user_id uuid primary key references auth.users on delete cascade
);
