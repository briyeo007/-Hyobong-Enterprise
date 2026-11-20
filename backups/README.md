# 백업 폴더

- `npm run db:backup` 실행 시 `backups/<날짜시간>/` 에 Supabase 공실 데이터·변경 이력·업로드 사진이 저장됩니다.
- `*.json` 백업 파일은 Git에 올라가지 않도록 제외되어 있습니다 (로컬 보관).
- 관리자 페이지 도입 이전 공실 데이터 원본은 `src/data/vacancies.seed.json` (Git에 포함) 입니다.
