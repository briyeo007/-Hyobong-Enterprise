import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getForAdmin, storeMode } from '@/lib/vacancy-store'
import { BUILDINGS, unitLabel } from '@/lib/vacancy-types'
import VacancyForm from '../../VacancyForm'
import styles from '../../admin.module.scss'

export const dynamic = 'force-dynamic'

export default async function EditVacancyPage({ params }: { params: { id: string } }) {
  const row = await getForAdmin(params.id)
  if (!row) notFound()
  const building = BUILDINGS.find((b) => b.id === row.building)
  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/admin" className={styles.backLink}>← 목록</Link>
        <h1 className={styles.topTitle}>{building?.name} · {unitLabel(row)}</h1>
      </header>
      <VacancyForm initial={row} readOnly={storeMode() === 'seed'} />
    </main>
  )
}
