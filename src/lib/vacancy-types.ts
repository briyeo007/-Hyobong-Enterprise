// 공실 데이터 공통 타입 · 홈페이지 표시용 변환 로직 (서버·클라이언트 공용)

export const BUILDINGS = [
  { id: 'hyobong8', name: '효봉8빌딩', path: '/hyobong8' },
  { id: 'bisan', name: '비산효봉', path: '/bisan' },
  { id: 'hyobong-enterprise', name: '효봉기업', path: '/hyobong-enterprise' },
] as const

export type BuildingId = (typeof BUILDINGS)[number]['id']

export const STATUSES = [
  { id: 'vacant', label: '공실' },
  { id: 'in_progress', label: '계약 진행 중' },
  { id: 'leased', label: '임대 완료' },
] as const

export type VacancyStatus = (typeof STATUSES)[number]['id']

export type SpecRow = { label: string; value: string }

/** DB(Supabase `vacancies` 테이블) 한 행 */
export type VacancyRow = {
  id: string
  building: BuildingId
  sort_order: number
  floor: string
  unit: string
  summary: string
  area_contract: number
  area_actual: number
  deposit: string
  rent: string
  maintenance: string
  /** YYYY-MM-DD, null = 즉시 입주 */
  available_date: string | null
  status: VacancyStatus
  tags: string[]
  detail_specs: SpecRow[]
  images: string[]
  updated_at?: string
}

/** 홈페이지 카드에 쓰이는 형태 (기존 PropertySection 타입과 동일 구조) */
export type Property = {
  id: string
  floor: string
  summary: string
  area: { contract: number; actual: number }
  deposit: string
  rent: string
  maintenance: string
  tags: string[]
  images: string[]
  urgency: string
  /** true = 즉시 입주가 아닌 호실(공실 예정·계약 진행 중) → 주황색 배지 */
  upcoming: boolean
  availability: 'now' | 'upcoming' | 'in_progress'
  detailSpecs: SpecRow[]
}

export type BuildingVacancies = {
  all: Property[]
  current: Property[]
  upcoming: Property[]
}

/** 한국 시간 기준 오늘 (YYYY-MM-DD) */
export function todayKST(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10)
}

export function formatMoveIn(date: string, today = todayKST()): string {
  const [y, m, d] = date.split('-').map(Number)
  const sameYear = String(y) === today.slice(0, 4)
  return `${sameYear ? '' : `${y}년 `}${m}월 ${d}일 입주 가능`
}

export function unitLabel(row: Pick<VacancyRow, 'floor' | 'unit'>): string {
  return [row.floor, row.unit].map((s) => s.trim()).filter(Boolean).join(' ')
}

const NOW_TAG = '즉시 입주 가능'

export function toProperty(row: VacancyRow, today = todayKST()): Property {
  const future = !!row.available_date && row.available_date > today
  const availability: Property['availability'] =
    row.status === 'in_progress' ? 'in_progress' : future ? 'upcoming' : 'now'

  const label =
    availability === 'in_progress' ? '계약 진행 중'
    : availability === 'upcoming' ? formatMoveIn(row.available_date!, today)
    : NOW_TAG

  // '즉시 입주 가능' 태그·'입주 가능' 상세항목은 입주 가능일/상태에 맞춰 자동 변경
  const tags = availability === 'now'
    ? row.tags
    : row.tags.map((t) => (t === NOW_TAG ? label : t))
  const detailSpecs = availability === 'now'
    ? row.detail_specs
    : row.detail_specs.map((s) => (s.label === '입주 가능' ? { ...s, value: label.replace(' 입주 가능', '') } : s))

  return {
    id: row.id,
    floor: unitLabel(row),
    summary: row.summary,
    area: { contract: Number(row.area_contract), actual: Number(row.area_actual) },
    deposit: row.deposit,
    rent: row.rent,
    maintenance: row.maintenance,
    tags,
    images: row.images,
    urgency: `✔ ${label}`,
    upcoming: availability !== 'now',
    availability,
    detailSpecs,
  }
}

export function sortRows(rows: VacancyRow[]): VacancyRow[] {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id))
}

/** 임대 완료 호실은 홈페이지에서 숨기고, 건물별로 현재 공실 / 공실 예정을 구분 */
export function groupForSite(rows: VacancyRow[]): Record<BuildingId, BuildingVacancies> {
  const today = todayKST()
  const out = {} as Record<BuildingId, BuildingVacancies>
  for (const b of BUILDINGS) {
    const all = sortRows(rows.filter((r) => r.building === b.id && r.status !== 'leased')).map((r) => toProperty(r, today))
    out[b.id] = {
      all,
      current: all.filter((p) => p.availability === 'now'),
      upcoming: all.filter((p) => p.availability === 'upcoming'),
    }
  }
  return out
}
