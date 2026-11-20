// 서버 전용: 공실 데이터 저장소
//  - supabase : 운영 (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 설정 시)
//  - local    : 로컬 테스트용 파일 저장소 (ADMIN_LOCAL_STORE=1, Vercel 외 환경에서만)
//  - seed     : 위 설정이 없을 때. 저장소 코드 이전의 공실 데이터(src/data/vacancies.seed.json)를 읽기 전용으로 사용
import { promises as fs } from 'fs'
import path from 'path'
import seed from '@/data/vacancies.seed.json'
import type { VacancyRow } from './vacancy-types'

export const VACANCY_TAG = 'vacancies'
export const IMAGE_BUCKET = 'vacancy-images'
const TABLE = 'vacancies'
const PUBLIC_REVALIDATE = 3600

export type StoreMode = 'supabase' | 'local' | 'seed'

export function storeMode(): StoreMode {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return 'supabase'
  if (process.env.ADMIN_LOCAL_STORE === '1' && !process.env.VERCEL) return 'local'
  return 'seed'
}

const SEED = seed as VacancyRow[]

// ───────── Supabase REST (의존성 없이 fetch 사용) ─────────
function sb() {
  const url = process.env.SUPABASE_URL!.replace(/\/+$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const headers: Record<string, string> = { apikey: key }
  // 기존 JWT 형식(service_role) 키만 Authorization 헤더에 사용, 신규 sb_secret_ 키는 apikey 헤더만 사용
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`
  return { url, headers }
}

async function sbFetch(pathAndQuery: string, init: RequestInit & { next?: { tags?: string[]; revalidate?: number } } = {}) {
  const { url, headers } = sb()
  const res = await fetch(`${url}${pathAndQuery}`, {
    ...init,
    headers: { ...headers, ...(init.headers as Record<string, string>) },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Supabase ${res.status}: ${body.slice(0, 300)}`)
  }
  return res
}

const COLUMNS =
  'id,building,sort_order,floor,unit,summary,area_contract,area_actual,deposit,rent,maintenance,available_date,status,tags,detail_specs,images,updated_at'

// ───────── 로컬 테스트 저장소 ─────────
const LOCAL_DIR = path.join(process.cwd(), '.local-admin')
const LOCAL_FILE = path.join(LOCAL_DIR, 'vacancies.json')
export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', '_local-uploads')

async function localRead(): Promise<VacancyRow[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8'))
  } catch {
    await localWrite(SEED)
    return structuredClone(SEED)
  }
}
async function localWrite(rows: VacancyRow[]) {
  await fs.mkdir(LOCAL_DIR, { recursive: true })
  await fs.writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2), 'utf8')
}

// ───────── 공개 API ─────────

/** 홈페이지용 조회: 1시간 캐시 + 관리자 저장 시 즉시 무효화(tag) */
export async function listForSite(): Promise<VacancyRow[]> {
  const mode = storeMode()
  if (mode === 'seed') return SEED
  if (mode === 'local') return localRead()
  const res = await sbFetch(`/rest/v1/${TABLE}?select=${COLUMNS}&order=building.asc,sort_order.asc`, {
    next: { tags: [VACANCY_TAG], revalidate: PUBLIC_REVALIDATE },
  })
  return orSeed(await res.json())
}

/** 테이블이 아직 비어 있으면(최초 데이터 입력 전) 기존 공실 데이터를 그대로 표시 → "공실 0개" 노출 방지 */
function orSeed(rows: VacancyRow[]): VacancyRow[] {
  return rows.length > 0 ? rows : SEED
}

/** 최초 저장 시 테이블이 비어 있으면 기존 공실 데이터를 먼저 넣음 (이미 있는 호실은 건드리지 않음) */
async function ensureSeeded() {
  const res = await sbFetch(`/rest/v1/${TABLE}?select=id&limit=1`, { cache: 'no-store' })
  if ((await res.json()).length > 0) return
  await sbFetch(`/rest/v1/${TABLE}?on_conflict=id`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify(SEED),
  })
}

/** 관리자용 조회: 캐시 없음 */
export async function listForAdmin(): Promise<VacancyRow[]> {
  const mode = storeMode()
  if (mode === 'seed') return SEED
  if (mode === 'local') return localRead()
  const res = await sbFetch(`/rest/v1/${TABLE}?select=${COLUMNS}&order=building.asc,sort_order.asc`, { cache: 'no-store' })
  return orSeed(await res.json())
}

export async function getForAdmin(id: string): Promise<VacancyRow | null> {
  const rows = await listForAdmin()
  return rows.find((r) => r.id === id) ?? null
}

export async function upsertVacancy(row: VacancyRow): Promise<void> {
  const mode = storeMode()
  if (mode === 'seed') throw new Error('저장소가 설정되지 않았습니다 (Supabase 환경변수 필요).')
  if (mode === 'local') {
    const rows = await localRead()
    const i = rows.findIndex((r) => r.id === row.id)
    const next = { ...row, updated_at: new Date().toISOString() }
    if (i >= 0) rows[i] = next
    else rows.push(next)
    await localWrite(rows)
    return
  }
  const { updated_at: _ignored, ...data } = row
  void _ignored
  await ensureSeeded()
  await sbFetch(`/rest/v1/${TABLE}?on_conflict=id`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
  })
}

export async function deleteVacancy(id: string): Promise<void> {
  const mode = storeMode()
  if (mode === 'seed') throw new Error('저장소가 설정되지 않았습니다 (Supabase 환경변수 필요).')
  if (mode === 'local') {
    await localWrite((await localRead()).filter((r) => r.id !== id))
    return
  }
  await ensureSeeded()
  await sbFetch(`/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', cache: 'no-store' })
}

/** 검증·정제가 끝난 JPEG 파일을 저장하고 공개 URL을 반환 */
export async function storeImage(objectPath: string, data: Buffer): Promise<string> {
  const mode = storeMode()
  if (mode === 'seed') throw new Error('저장소가 설정되지 않았습니다 (Supabase 환경변수 필요).')
  if (mode === 'local') {
    const file = path.join(LOCAL_UPLOAD_DIR, objectPath)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, data)
    return `/_local-uploads/${objectPath}`
  }
  await sbFetch(`/storage/v1/object/${IMAGE_BUCKET}/${objectPath}`, {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'image/jpeg', 'x-upsert': 'false', 'Cache-Control': 'max-age=31536000' },
    body: new Uint8Array(data),
  })
  return `${sb().url}/storage/v1/object/public/${IMAGE_BUCKET}/${objectPath}`
}

/** 공실 데이터에 저장 가능한 이미지 URL인지 확인 (기존 /images 경로 또는 이 저장소에 업로드된 파일만 허용) */
export function isAllowedImageUrl(u: string): boolean {
  if (/^\/images\/[\w\-./]+\.(jpe?g|png|webp)$/i.test(u) && !u.includes('..')) return true
  const mode = storeMode()
  if (mode === 'local') return /^\/_local-uploads\/[\w\-/]+\.jpg$/.test(u)
  if (mode === 'supabase') {
    const prefix = `${sb().url}/storage/v1/object/public/${IMAGE_BUCKET}/`
    return u.startsWith(prefix) && /^[\w\-/]+\.jpg$/.test(u.slice(prefix.length))
  }
  return false
}
