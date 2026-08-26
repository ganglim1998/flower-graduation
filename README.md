# 꽃길 — 꽃집 사장님을 위한 지역 졸업식 영업정보 MVP

내 꽃집 위치를 등록하면 반경 내 학교의 졸업식 일정을 거리순·날짜순으로 보여주는 모바일 웹.

## 실행 순서

### 1. Supabase 설정

Supabase 대시보드 > SQL Editor 에서 `supabase/migrations` 의 파일을 **번호 순서대로** 실행한다.

| 파일 | 내용 |
| --- | --- |
| `0001_extensions.sql` | PostGIS 활성화 |
| `0002_tables.sql` | florists / schools / graduation_events / favorite_schools / admins |
| `0003_rls.sql` | Row Level Security 정책 |
| `0004_rpc_nearby_schools.sql` | `ST_DWithin` 반경 검색 RPC |
| `0005_rpc_upsert_florist.sql` | 매장 저장·조회 RPC |
| `0006_rpc_school_detail.sql` | 학교 상세·관심 학교 RPC |

그다음 시드를 실행한다.
- `supabase/seed/seoul_schools.sql` — 강남/서초 예시 초·중·고 10곳, 졸업식 7건 (좌표는 근사값)
- `supabase/seed/seoul_universities.sql` — 서울 소재 대학 55곳(캠퍼스 분리), 전기·후기 학위수여식 110건 (좌표는 카카오 API 실측)
(좌표와 일정은 흐름 검증용 근사값이다. 실서비스 전 NEIS 학교기본정보 API나 실제 CSV로 교체할 것.)

**인증 설정 (카카오 로그인)**

1. 카카오 개발자 콘솔 > 꽃길 앱 > **카카오 로그인** > 활성화 설정 ON
2. 같은 화면의 **Redirect URI** 에 `https://<프로젝트ref>.supabase.co/auth/v1/callback` 등록
3. **보안** 탭에서 Client Secret 생성 후 활성화
4. Supabase > Authentication > Providers > **Kakao** 활성화,
   Client ID 에 REST API 키, Client Secret 에 위에서 만든 값 입력
5. Supabase > Authentication > URL Configuration > Redirect URLs 에
   `http://localhost:3000/auth/callback` 추가

**관리자 지정**: 한 번 로그인한 뒤, SQL Editor 에서 아래를 실행하면 `/admin` 에 접근할 수 있다.

```sql
insert into admins (user_id)
select id from auth.users where email = 'your@email.com';
```

### 2. 환경변수

`.env.local` 에 Supabase URL 과 anon 키를 채운다. 카카오 키는 비워도 동작한다(목업 모드).

### 3. 개발 서버

```bash
npm run dev
```

## 카카오 목업 모드

`NEXT_PUBLIC_KAKAO_JS_KEY` 가 없으면 지도가 좌표 기반 간이 뷰로, `KAKAO_REST_API_KEY` 가 없으면
주소 검색이 `src/lib/kakao/mock-addresses.ts` 의 목 데이터로 동작한다. 키를 채우면 코드 수정 없이
실제 카카오맵 SDK와 로컬 API로 전환된다.

카카오 개발자 콘솔에서 필요한 것:
- JavaScript 키 + 플랫폼 > Web 에 `http://localhost:3000` 도메인 등록 (등록하지 않으면 지도가 뜨지 않는다)
- REST API 키 (서버에서만 사용, 클라이언트에 노출되지 않는다)

## 구조

```
src/
  app/            라우팅과 화면 조립 (App Router)
    api/geocode/  카카오 로컬 API 프록시 (주소<->좌표)
  features/       도메인별 로직: florist / school / graduation / favorite
  components/     지도, 하단 탭 등 공용 UI
  lib/            supabase 클라이언트, 카카오 로더, 좌표 유틸
supabase/
  migrations/     스키마 마이그레이션 SQL
  seed/           초기 학교 데이터
```

## 화면 흐름

랜딩 → 카카오 로그인 → 매장 위치 등록(`/onboarding`) → 주변 학교(`/schools`) →
학교 상세(`/schools/[id]`) → 관심 학교(`/favorites`) / 내 매장(`/settings`)

관리자는 `/admin` 에서 학교를 검색해 졸업식 일정을 추가·수정·삭제한다.

## 배포 (Vercel)

### 1. Vercel 환경변수

Project Settings > Environment Variables 에 4개를 등록한다 (Production/Preview/Development 모두 체크).

| 이름 | 값 | 비고 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public 키 | 클라이언트 노출되는 값 |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 JavaScript 키 | 클라이언트 노출되는 값 |
| `KAKAO_REST_API_KEY` | 카카오 REST API 키 | **서버 전용. NEXT_PUBLIC_ 접두어를 붙이지 말 것** |

### 2. 배포 후 도메인 등록

배포 주소(`https://<프로젝트>.vercel.app`)를 세 곳에 추가한다. 하나라도 빠지면 지도나 로그인이 동작하지 않는다.

- **카카오 개발자 콘솔 > 앱 > 플랫폼 키 > JavaScript 키 > JavaScript SDK 도메인**
  → 배포 주소 추가 (지도 SDK 가 Referer 로 검사한다)
- **Supabase > Authentication > URL Configuration > Site URL**
  → 배포 주소로 변경
- **Supabase > Authentication > URL Configuration > Redirect URLs**
  → `https://<프로젝트>.vercel.app/auth/callback` 추가

카카오 로그인의 Redirect URI 는 Supabase 콜백(`https://<ref>.supabase.co/auth/v1/callback`)이므로 배포해도 바뀌지 않는다.

### 3. 확인

- 홈에서 졸업식 목록이 보이는지 (공개 읽기 RLS 필요)
- 카카오 로그인 → 매장 등록 → 주변 학교 조회
- 매장 등록 화면에서 지도에 핀이 뜨는지 (뜨지 않으면 JavaScript SDK 도메인 미등록)
