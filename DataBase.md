# DDL 실습

## 문제 1: 테이블 생성하기 (CREATE TABLE)
- attendance 테이블은 중복된 데이터가 쌓이는 구조이다. 중복된 데이터는 어떤 컬럼인가?
  - nickname 컬럼입니다. 출석 기록이 생길 때마다 동일한 crew_id에 대해 같은 닉네임이 계속 반복해서 저장되어 저장 공간을 낭비하고 있습니다.

- attendance 테이블에서 중복을 제거하기 위해 crew 테이블을 만들려고 한다. 어떻게 구성해 볼 수 있을까?
  - 크루를 고유하게 식별할 수 있는 crew_id(기본 키)와 크루의 이름인 nickname 두 개의 컬럼으로 깔끔하게 구성하면 됩니다.
 
- crew 테이블에 들어가야 할 크루들의 정보는 어떻게 추출할까? (hint: DISTINCT)
  - SELECT DISTINCT crew_id, nickname FROM attendance; 쿼리를 사용하면, 수많은 출석 기록 속에서 중복을 제외한 고유한 크루 목록만 딱 뽑아낼 수 있습니다.
 
```sql
SELECT DISTINCT crew_id, nickname
FROM attendance
ORDER BY crew_id;
```

- 최종적으로 crew 테이블 생성
  
```sql
CREATE TABLE crew (
  crew_id INT NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  PRIMARY KEY (crew_id)
);
```

- attendance 테이블에서 크루 정보를 추출해서 crew 테이블에 삽입하기
  
```sql
INSERT INTO crew (crew_id, nickname)
SELECT DISTINCT crew_id, nickname
FROM attendance
ORDER BY crew_id;
```

## 문제 2: 테이블 컬럼 삭제하기 (ALTER TABLE)
- 생각해보기: 불필요해지는 컬럼은?
  - crew 테이블이 생성되어 crew_id로 nickname을 조회할 수 있으므로, attendance 테이블의 nickname 컬럼이 불필요해진다.

- 컬럼 삭제
```sql
ALTER TABLE attendance DROP COLUMN nickname;
```

## 문제 3: 외래키 설정하기

```sql
ALTER TABLE attendance
MODIFY COLUMN crew_id BIGINT NOT NULL;

ALTER TABLE attendance
ADD CONSTRAINT fk_crew_id
FOREIGN KEY (crew_id) REFERENCES crew(crew_id);
```

## 문제 4: 유니크 키 설정

```sql
ALTER TABLE crew ADD UNIQUE (nickname);
```

# DML 실습

## 문제 5: 크루 닉네임 검색하기 (LIKE)

```sql
SELECT * FROM crew
WHERE nickname LIKE '디%';
```

## 문제 6: 출석 기록 확인하기 (SELECT + WHERE)

```sql
SELECT * FROM attendance
WHERE attendance_date = '2025-03-06' 
  AND crew_id = (SELECT crew_id FROM crew WHERE nickname = '어셔');
```

## 문제 7: 누락된 출석 기록 추가 (INSERT)

```sql
INSERT INTO attendance (crew_id, attendance_date, start_time, end_time)
VALUES (
  (SELECT crew_id FROM crew WHERE nickname = '어셔'), 
  '2025-03-06', '09:31', '18:01'
);
```

## 문제 8: 잘못된 출석 기록 수정 (UPDATE)

```sql
UPDATE attendance
SET start_time = '10:00'
WHERE attendance_date = '2025-03-12' 
  AND crew_id = (SELECT crew_id FROM crew WHERE nickname = '주니');
```

## 문제 9: 허위 출석 기록 삭제 (DELETE)

```sql
DELETE FROM attendance
WHERE attendance_date = '2025-03-12' 
  AND crew_id = (SELECT crew_id FROM crew WHERE nickname = '아론');
```

## 문제 10: 출석 정보 조회하기 (JOIN)

```sql
SELECT c.nickname, a.attendance_date, a.start_time, a.end_time
FROM crew AS c
INNER JOIN attendance AS a ON c.crew_id = a.crew_id;
```

## 문제 11: nickname으로 쿼리 처리하기 (서브 쿼리)

```sql
SELECT *
FROM attendance
WHERE crew_id = (
    SELECT crew_id FROM crew WHERE nickname = '검프'
);
```

## 문제 12: 가장 늦게 하교한 크루 찾기

```sql
SELECT c.nickname, a.end_time
FROM attendance AS a
INNER JOIN crew AS c ON a.crew_id = c.crew_id
WHERE a.attendance_date = '2025-03-05'
ORDER BY a.end_time DESC
LIMIT 1;
```

# 집계 함수 실습

## 문제 13: 크루별로 '기록된' 날짜 수 조회

```sql
SELECT c.nickname, COUNT(a.attendance_date) AS record_count
FROM crew AS c
INNER JOIN attendance AS a ON c.crew_id = a.crew_id
GROUP BY c.nickname;
```

## 문제 14: 크루별로 등교 기록이 있는(start_time IS NOT NULL) 날짜 수 조회

```sql
SELECT c.nickname, COUNT(a.start_time) AS attendance_days
FROM crew AS c
INNER JOIN attendance AS a ON c.crew_id = a.crew_id
WHERE a.start_time IS NOT NULL
GROUP BY c.nickname;
```

## 문제 15: 날짜별로 등교한 크루 수 조회

```sql
SELECT attendance_date, COUNT(DISTINCT crew_id) AS crew_count
FROM attendance
WHERE start_time IS NOT NULL
GROUP BY attendance_date;
```

## 문제 16: 크루별 가장 빠른 등교 시각(MIN)과 가장 늦은 등교 시각(MAX)

```sql
SELECT c.nickname, MIN(a.start_time) AS fastest_start, MAX(a.start_time) AS latest_start
FROM crew AS c
INNER JOIN attendance AS a ON c.crew_id = a.crew_id
GROUP BY c.nickname;
```

