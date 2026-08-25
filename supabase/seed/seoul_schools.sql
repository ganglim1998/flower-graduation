-- 강남/서초 일대 예시 시드 데이터.
-- 주의: 좌표와 졸업식 일정은 흐름 검증용 근사값이다.
-- 실서비스 전 NEIS 학교기본정보 API 또는 실제 CSV로 교체할 것.
insert into schools (name, school_type, address, location) values
  ('강남초등학교', '초', '서울 강남구 학동로 20',      st_point(127.0290, 37.5140)::geography),
  ('논현초등학교', '초', '서울 강남구 학동로 108',     st_point(127.0330, 37.5115)::geography),
  ('청담초등학교', '초', '서울 강남구 삼성로 728',     st_point(127.0530, 37.5230)::geography),
  ('언주중학교',   '중', '서울 강남구 논현로 626',     st_point(127.0345, 37.5075)::geography),
  ('역삼중학교',   '중', '서울 강남구 역삼로 415',     st_point(127.0430, 37.4995)::geography),
  ('숙명여자중학교','중', '서울 강남구 도곡로 464',     st_point(127.0480, 37.4930)::geography),
  ('경기고등학교', '고', '서울 강남구 영동대로 643',   st_point(127.0560, 37.5140)::geography),
  ('중동고등학교', '고', '서울 강남구 봉은사로 524',   st_point(127.0510, 37.5090)::geography),
  ('서초고등학교', '고', '서울 서초구 반포대로 30길 65', st_point(127.0080, 37.4880)::geography),
  ('반포고등학교', '고', '서울 서초구 신반포로 15길 63', st_point(127.0020, 37.5040)::geography);

-- 졸업식 일정 (2027년 2월 예시)
insert into graduation_events (school_id, graduation_date, graduation_time, student_count, note)
select id, d, t, c, n from schools
join (values
  ('강남초등학교', date '2027-02-10', time '10:00', 180, null),
  ('논현초등학교', date '2027-02-11', time '10:30', 150, null),
  ('언주중학교',   date '2027-02-05', time '10:00', 240, '체육관에서 진행'),
  ('역삼중학교',   date '2027-02-05', time '14:00', 260, null),
  ('경기고등학교', date '2027-02-04', time '10:00', 420, '학부모 참석 인원 많음'),
  ('중동고등학교', date '2027-02-08', time '10:00', 380, null),
  ('서초고등학교', date '2027-02-09', time '10:00', 350, null)
) as v(school_name, d, t, c, n) on schools.name = v.school_name;
