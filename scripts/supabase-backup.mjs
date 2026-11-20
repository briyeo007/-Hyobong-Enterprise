// 공실 데이터 + 변경 이력 + 업로드 사진을 backups/<날짜시간>/ 에 내려받습니다. (읽기 전용 작업)
// 사용: npm run db:backup            (사진 제외: npm run db:backup -- --no-images)
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { sb, URL_ } from './_supabase.mjs'

const stamp = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 19).replace(/[:T]/g, '-')
const dir = path.join('backups', stamp)
await mkdir(dir, { recursive: true })

const rows = await (await sb('/rest/v1/vacancies?select=*&order=building,sort_order')).json()
await writeFile(path.join(dir, 'vacancies.json'), JSON.stringify(rows, null, 2))
const history = await (await sb('/rest/v1/vacancies_history?select=*&order=changed_at.desc&limit=5000')).json()
await writeFile(path.join(dir, 'vacancies_history.json'), JSON.stringify(history, null, 2))
console.log(`공실 ${rows.length}건, 이력 ${history.length}건 저장 → ${dir}`)

if (!process.argv.includes('--no-images')) {
  const prefix = `${URL_}/storage/v1/object/public/vacancy-images/`
  const urls = [...new Set(rows.flatMap((r) => r.images).filter((u) => u.startsWith(prefix)))]
  let n = 0
  for (const u of urls) {
    const rel = u.slice(prefix.length)
    const out = path.join(dir, 'images', ...rel.split('/'))
    await mkdir(path.dirname(out), { recursive: true })
    const res = await fetch(u)
    if (!res.ok) { console.warn('사진 다운로드 실패:', u); continue }
    await writeFile(out, Buffer.from(await res.arrayBuffer()))
    n++
  }
  console.log(`업로드 사진 ${n}/${urls.length}장 저장 (기존 /images 사진은 Git 저장소에 보관됨)`)
}
