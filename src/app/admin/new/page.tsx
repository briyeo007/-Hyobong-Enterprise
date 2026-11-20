import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listForAdmin, storeMode } from '@/lib/vacancy-store'
import { BUILDINGS, type BuildingId } from '@/lib/vacancy-types'
import VacancyForm from '../VacancyForm'
import styles from '../admin.module.scss'

export const dynamic = 'force-dynamic'

export default async function NewVacancyPage({ searchParams }: { searchParams: { building?: string } }) {
  const building = BUILDINGS.find((b) => b.id === searchParams.building)
  if (!building) notFound()
  const siblings = (await listForAdmin()).filter((r) => r.building === building.id)
  const maxSort = siblings.reduce((m, r) => Math.max(m, r.sort_order), 0)
  // 같은 건물 첫 호실의 상세 정보 항목을 기본값으로 제공 (수정 가능)
  const template = siblings[0]?.detail_specs ?? []

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.backLink}>← 목록</Link>
        <h1 className={styles.topTitle}>{building.name} · 공실 추가</h1>
      </header>
      <VacancyForm
        readOnly={storeMode() === 'seed'}
        initial={{
          id: '',
          building: building.id as BuildingId,
          sort_order: maxSort + 10,
          floor: '',
          unit: '',
          summary: '',
          area_contract: 0,
          area_actual: 0,
          deposit: '',
          rent: '',
          maintenance: '',
          available_date: null,
          status: 'vacant',
          tags: ['즉시 입주 가능'],
          detail_specs: template,
          images: [],
        }}
      />
    </main>
  )
}
