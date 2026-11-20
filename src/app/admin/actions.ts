'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { checkPassword, createSessionToken, SESSION_COOKIE, SESSION_TTL_SEC, authConfigured } from '@/lib/admin-auth'
import { requireAdmin } from '@/lib/admin-guard'
import { BUILDINGS, STATUSES, type VacancyRow } from '@/lib/vacancy-types'
import {
  VACANCY_TAG,
  deleteVacancy,
  getForAdmin,
  isAllowedImageUrl,
  storeMode,
  upsertVacancy,
} from '@/lib/vacancy-store'

// ───────── 로그인 ─────────

// 로그인 시도 제한 (인스턴스 단위, 15분에 5회)
const attempts = new Map<string, { n: number; until: number }>()
const WINDOW_MS = 15 * 60 * 1000

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  if (!authConfigured()) return { error: '관리자 비밀번호가 서버에 설정되지 않았습니다.' }
  const ip = (headers().get('x-forwarded-for') ?? 'local').split(',')[0].trim()
  const now = Date.now()
  const rec = attempts.get(ip)
  if (rec && rec.until > now && rec.n >= 5) {
    return { error: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요.' }
  }

  const password = String(formData.get('password') ?? '')
  if (!(await checkPassword(password))) {
    const cur = rec && rec.until > now ? rec : { n: 0, until: now + WINDOW_MS }
    attempts.set(ip, { n: cur.n + 1, until: cur.until })
    await new Promise((r) => setTimeout(r, 800))
    return { error: '비밀번호가 올바르지 않습니다.' }
  }
  attempts.delete(ip)

  cookies().set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SEC,
  })
  redirect('/admin')
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE)
  redirect('/admin/login')
}

// ───────── 공실 저장 / 삭제 ─────────

export type VacancyInput = Omit<VacancyRow, 'updated_at' | 'id'> & { id: string | null }
export type ActionResult = { ok: true; id: string } | { ok: false; error: string }

const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)
const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 && n <= 100000 ? Math.round(n * 100) / 100 : NaN
}

function revalidateSite() {
  revalidateTag(VACANCY_TAG)
  revalidatePath('/')
  for (const b of BUILDINGS) revalidatePath(b.path)
}

export async function saveVacancyAction(input: VacancyInput): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: '로그인이 만료되었습니다. 다시 로그인해 주세요.' }
  }
  if (storeMode() === 'seed') return { ok: false, error: '저장소(Supabase)가 아직 연결되지 않아 저장할 수 없습니다.' }

  if (!BUILDINGS.some((b) => b.id === input.building)) return { ok: false, error: '건물 값이 올바르지 않습니다.' }
  if (!STATUSES.some((s) => s.id === input.status)) return { ok: false, error: '상태 값이 올바르지 않습니다.' }

  const floor = str(input.floor, 30)
  const unit = str(input.unit, 30)
  if (!floor && !unit) return { ok: false, error: '층수 또는 호실을 입력해 주세요.' }

  const areaContract = num(input.area_contract)
  const areaActual = num(input.area_actual)
  if (Number.isNaN(areaContract) || Number.isNaN(areaActual)) return { ok: false, error: '면적은 0 이상의 숫자로 입력해 주세요.' }

  let availableDate: string | null = null
  if (input.available_date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.available_date) || Number.isNaN(Date.parse(input.available_date))) {
      return { ok: false, error: '입주 가능일 형식이 올바르지 않습니다.' }
    }
    availableDate = input.available_date
  }

  const images = Array.isArray(input.images) ? input.images.map(String) : []
  if (images.length > 30) return { ok: false, error: '사진은 최대 30장까지 등록할 수 있습니다.' }
  if (images.some((u) => !isAllowedImageUrl(u))) return { ok: false, error: '허용되지 않은 사진 주소가 포함되어 있습니다.' }

  const tags = (Array.isArray(input.tags) ? input.tags : []).map((t) => str(t, 30)).filter(Boolean).slice(0, 12)
  const detailSpecs = (Array.isArray(input.detail_specs) ? input.detail_specs : [])
    .map((s) => ({ label: str(s?.label, 30), value: str(s?.value, 100) }))
    .filter((s) => s.label && s.value)
    .slice(0, 20)

  let id = input.id
  if (id) {
    if (!/^[\w-]{1,64}$/.test(id)) return { ok: false, error: '잘못된 요청입니다.' }
    const existing = await getForAdmin(id)
    if (!existing) return { ok: false, error: '해당 공실을 찾을 수 없습니다. 목록을 새로고침해 주세요.' }
    if (existing.building !== input.building) return { ok: false, error: '건물은 변경할 수 없습니다.' }
  } else {
    id = `v-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
  }

  const sortOrder = Math.trunc(Number(input.sort_order))
  const row: VacancyRow = {
    id,
    building: input.building,
    sort_order: Number.isFinite(sortOrder) ? Math.max(0, Math.min(sortOrder, 9999)) : 0,
    floor,
    unit,
    summary: str(input.summary, 120),
    area_contract: areaContract,
    area_actual: areaActual,
    deposit: str(input.deposit, 30),
    rent: str(input.rent, 30),
    maintenance: str(input.maintenance, 30),
    available_date: availableDate,
    status: input.status,
    tags,
    detail_specs: detailSpecs,
    images,
  }

  try {
    await upsertVacancy(row)
  } catch (e) {
    console.error('[admin] save failed', e)
    return { ok: false, error: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }
  revalidateSite()
  return { ok: true, id }
}

/** 목록 화면에서 상태만 변경 (다른 항목은 서버의 최신 값 유지) */
export async function setStatusAction(id: string, status: VacancyRow['status']): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: '로그인이 만료되었습니다. 다시 로그인해 주세요.' }
  }
  if (!/^[\w-]{1,64}$/.test(id) || !STATUSES.some((s) => s.id === status)) return { ok: false, error: '잘못된 요청입니다.' }
  try {
    const existing = await getForAdmin(id)
    if (!existing) return { ok: false, error: '해당 공실을 찾을 수 없습니다.' }
    await upsertVacancy({ ...existing, status })
  } catch (e) {
    console.error('[admin] status failed', e)
    return { ok: false, error: '저장 중 오류가 발생했습니다.' }
  }
  revalidateSite()
  return { ok: true, id }
}

export async function deleteVacancyAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { ok: false, error: '로그인이 만료되었습니다. 다시 로그인해 주세요.' }
  }
  if (!/^[\w-]{1,64}$/.test(id)) return { ok: false, error: '잘못된 요청입니다.' }
  try {
    await deleteVacancy(id)
  } catch (e) {
    console.error('[admin] delete failed', e)
    return { ok: false, error: '삭제 중 오류가 발생했습니다.' }
  }
  revalidateSite()
  return { ok: true, id }
}
