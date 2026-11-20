'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { VacancyRow, VacancyStatus } from '@/lib/vacancy-types'
import { setStatusAction } from './actions'
import styles from './admin.module.scss'

type Props = {
  row: VacancyRow
  disabled?: boolean
  statuses: { id: VacancyStatus; label: string }[]
}

/** 목록에서 바로 상태(공실 / 계약 진행 중 / 임대 완료) 변경 */
export default function StatusQuick({ row, disabled, statuses }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(row.status)
  const [pending, start] = useTransition()
  const [error, setError] = useState('')

  const change = (next: VacancyStatus) => {
    if (next === status || disabled) return
    const prev = status
    setStatus(next)
    setError('')
    start(async () => {
      const res = await setStatusAction(row.id, next)
      if (!res.ok) {
        setStatus(prev)
        setError(res.error)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className={styles.statusQuick}>
      <div className={styles.segment} role="radiogroup" aria-label="상태">
        {statuses.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={status === s.id}
            className={`${styles.segBtn} ${status === s.id ? styles[`seg_${s.id}`] : ''}`}
            onClick={() => change(s.id)}
            disabled={disabled || pending}
          >
            {s.label}
          </button>
        ))}
      </div>
      {pending && <span className={styles.muted}>저장 중…</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
