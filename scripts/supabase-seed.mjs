// 최초 1회: 현재 홈페이지 공실 데이터(src/data/vacancies.seed.json)를 Supabase에 넣습니다.
// 이미 존재하는 호실(id)은 절대 덮어쓰지 않습니다 (관리자 수정 내용 보호).
// 사용: npm run db:seed
import { readFile } from 'node:fs/promises'
import { sb } from './_supabase.mjs'

const seed = JSON.parse(await readFile('src/data/vacancies.seed.json', 'utf8'))
const existing = await (await sb('/rest/v1/vacancies?select=id')).json()
const have = new Set(existing.map((r) => r.id))
const missing = seed.filter((r) => !have.has(r.id))

if (missing.length === 0) {
  console.log(`추가할 데이터가 없습니다 (이미 ${existing.length}건 존재).`)
  process.exit(0)
}
await sb('/rest/v1/vacancies?on_conflict=id', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
  body: JSON.stringify(missing),
})
console.log(`${missing.length}건 추가 완료: ${missing.map((r) => r.id).join(', ')}`)
