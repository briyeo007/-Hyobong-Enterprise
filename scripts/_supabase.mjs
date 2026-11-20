// 공용: .env.local 의 SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 로 Supabase REST 호출
import { existsSync } from 'node:fs'

for (const f of ['.env.local', '.env']) {
  if (existsSync(f)) {
    try { process.loadEnvFile(f) } catch { /* ignore */ }
  }
}

export const URL_ = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL.trim()).origin : ''
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()
if (!URL_ || !KEY) {
  console.error('SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다 (.env.local).')
  process.exit(1)
}

export async function sb(path, init = {}) {
  const headers = { apikey: KEY, ...(KEY.startsWith('eyJ') ? { Authorization: `Bearer ${KEY}` } : {}), ...(init.headers ?? {}) }
  const res = await fetch(`${URL_}${path}`, { ...init, headers })
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return res
}
