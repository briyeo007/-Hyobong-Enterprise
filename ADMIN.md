# 관리자 페이지 (/admin) 안내

공실 정보·사진을 PC·스마트폰에서 수정하는 관리자 전용 페이지입니다.
디자인·레이아웃은 기존처럼 VS Code에서 수정하고 배포하면 되며, **공실 데이터는 Supabase에 저장되므로 재배포해도 초기화되지 않습니다.**

## 구조

| 항목 | 위치 |
|---|---|
| 공실 데이터 | Supabase `vacancies` 테이블 (수정·삭제 이력은 `vacancies_history`에 자동 보관) |
| 업로드 사진 | Supabase Storage `vacancy-images` 버킷 (기존 사진은 계속 `public/images`) |
| 홈페이지 반영 | 저장 즉시 `/`, `/hyobong8`, `/bisan`, `/hyobong-enterprise` 갱신 (그 외 1시간마다 자동 확인) |
| 최초 데이터 원본 | `src/data/vacancies.seed.json` (Supabase 미연결 시 홈페이지가 이 데이터를 그대로 표시) |

## 최초 설정 (1회)

1. https://supabase.com 에서 프로젝트 생성 (무료 플랜 가능, Region: Northeast Asia (Seoul))
2. Supabase → SQL Editor → `supabase/schema.sql` 전체 붙여넣기 → Run
3. Supabase → Project Settings → API 에서 URL과 `service_role`(또는 `secret`) 키 확인
4. Vercel → Settings → Environment Variables 에 `.env.example`의 4개 값 등록
5. 로컬 `.env.local`에도 `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` 추가 후 `npm run db:seed`
   → 현재 홈페이지 공실 7건을 Supabase에 복사 (이미 있는 호실은 덮어쓰지 않음)
6. 배포 후 `https://www.hyobongkiup.com/admin` 접속 → 비밀번호 로그인

## 사용 방법

- **상태 변경**: 목록에서 [공실 / 계약 진행 중 / 임대 완료] 버튼 → 즉시 저장
  - 공실: 홈페이지 표시, 공실 개수에 포함
  - 계약 진행 중: 홈페이지에 "계약 진행 중"으로 표시, 공실 개수에서 제외
  - 임대 완료: 홈페이지에서 숨김 (데이터는 유지 → 나중에 다시 공실로 전환 가능)
- **입주 가능일**: 미래 날짜 지정 시 "공실 예정"으로 표시, 해당 날짜부터 자동으로 현재 공실로 전환
- **사진**: 추가(여러 장) / ◀▶ 순서 변경 / 교체 / 삭제 → **[저장]을 눌러야 반영**
  - 휴대폰 사진은 자동 축소·회전 보정되며, 위치정보(EXIF/GPS)는 제거됩니다.

## 백업 · 복구

```bash
npm run db:backup                                   # backups/<날짜시간>/ 에 데이터·이력·사진 저장
npm run db:restore -- backups/<날짜시간>/vacancies.json         # 내용 확인
npm run db:restore -- backups/<날짜시간>/vacancies.json --yes   # 실제 복구
```

- 개별 수정 실수는 Supabase → Table Editor → `vacancies_history` 에서 이전 값(`old_row`)을 확인할 수 있습니다.
- Supabase 유료 플랜(Pro)은 일 단위 자동 백업이 포함됩니다.

## 보안

- 비밀번호 1개 로그인, 서명된 HttpOnly·SameSite=Strict 쿠키 (12시간 유효). 비밀번호를 바꾸면 기존 로그인 모두 해제
- middleware + 모든 저장 기능에서 서버 측 권한 재검증, 다른 사이트에서의 요청 차단
- 로그인 실패 5회 시 15분 제한 (서버 인스턴스 단위)
- 업로드: 4MB 이하, 실제 이미지 디코딩 검증 후 JPEG로 재인코딩 (위장 파일·SVG 차단), 무작위 파일명
- Supabase 테이블은 RLS로 외부 접근 전면 차단, 서버만 service_role 키로 접근
- /admin 은 검색엔진 색인 금지(noindex, robots.txt), 캐시 금지
