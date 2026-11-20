// 백업 파일로 공실 데이터를 복구합니다. (운영 데이터 변경 작업 — 실행 전 반드시 npm run db:backup 으로 현재 상태를 먼저 백업하세요)
// 사용: npm run db:restore -- backups/<날짜시간>/vacancies.json --yes
//   · 백업 파일의 호실은 백업 시점 값으로 덮어씁니다.
//   · 백업 이후 새로 추가된 호실은 삭제하지 않습니다(필요 시 관리자 페이지에서 삭제).
// 특정 시점의 한 호실만 되돌리려면 Supabase 대시보드의 vacancies_history 테이블에서 old_row 값을 확인하세요.
import { readFile } from 'node:fs/promises'
import { sb } from './_supabase.mjs'

const file = process.argv.find((a) => a.endsWith('.json'))
if (!file) {
  console.error('복구할 백업 파일 경로를 지정하세요. 예: npm run db:restore -- backups/2026-11-20-15-00-00/vacancies.json --yes')
  process.exit(1)
}
const rows = JSON.parse(await readFile(file, 'utf8'))
if (!Array.isArray(rows) || rows.some((r) => !r.id || !r.building)) {
  console.error('백업 파일 형식이 올바르지 않습니다.')
  process.exit(1)
}
console.log(`${file}: ${rows.length}건 (${rows.map((r) => r.id).join(', ')})`)
if (!process.argv.includes('--yes')) {
  console.log('확인 후 --yes 를 붙여 다시 실행하면 복구합니다.')
  process.exit(0)
}
const clean = rows.map(({ created_at, ...r }) => ({ ...r, updated_at: new Date().toISOString() }))
await sb('/rest/v1/vacancies?on_conflict=id', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
  body: JSON.stringify(clean),
})
console.log('복구 완료. 홈페이지는 최대 1시간 내 반영되며, 관리자 페이지에서 아무 호실이나 저장하면 즉시 반영됩니다.')
