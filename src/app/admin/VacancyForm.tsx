'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { STATUSES, type SpecRow, type VacancyRow, type VacancyStatus } from '@/lib/vacancy-types'
import { deleteVacancyAction, saveVacancyAction } from './actions'
import styles from './admin.module.scss'

const MAX_UPLOAD = 4 * 1024 * 1024

/** 휴대폰 원본 사진을 업로드 전에 브라우저에서 축소 (최대 2400px, JPEG) */
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, 2400 / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bmp.width * scale)
    canvas.height = Math.round(bmp.height * scale)
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    bmp.close()
    for (const q of [0.88, 0.75, 0.6]) {
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', q))
      if (blob && blob.size <= MAX_UPLOAD) return blob
    }
  } catch {
    /* 브라우저가 디코딩하지 못하면 원본 전송 → 서버에서 검증 */
  }
  return file
}

async function uploadOne(file: File, building: string): Promise<string> {
  const blob = await shrink(file)
  if (blob.size > MAX_UPLOAD) throw new Error(`${file.name}: 파일이 너무 큽니다 (최대 4MB).`)
  const fd = new FormData()
  fd.append('file', blob, 'photo.jpg')
  fd.append('building', building)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd, credentials: 'same-origin' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.url) throw new Error(data.error || `업로드 실패 (${res.status})`)
  return data.url as string
}

type Props = { initial: VacancyRow; readOnly?: boolean }

export default function VacancyForm({ initial, readOnly }: Props) {
  const router = useRouter()
  const isNew = !initial.id
  const [v, setV] = useState(() => ({
    ...initial,
    tagsText: initial.tags.join(', '),
    immediate: !initial.available_date,
  }))
  const [specs, setSpecs] = useState<SpecRow[]>(initial.detail_specs)
  const [images, setImages] = useState<string[]>(initial.images)
  const [dirty, setDirty] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [uploading, setUploading] = useState('')
  const [saving, startSave] = useTransition()
  const addInput = useRef<HTMLInputElement>(null)
  const replaceInput = useRef<HTMLInputElement>(null)
  const replaceIndex = useRef(-1)

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => {
    setV((p) => ({ ...p, [k]: val }))
    setDirty(true)
  }
  const touch = () => setDirty(true)

  const onAdd = async (files: FileList | null) => {
    if (!files?.length) return
    setMsg(null)
    const list = Array.from(files).slice(0, 20)
    const added: string[] = []
    try {
      for (let i = 0; i < list.length; i++) {
        setUploading(`사진 업로드 중… (${i + 1}/${list.length})`)
        added.push(await uploadOne(list[i], v.building))
      }
    } catch (e) {
      setMsg({ type: 'err', text: (e as Error).message })
    } finally {
      if (added.length) {
        setImages((p) => [...p, ...added])
        touch()
      }
      setUploading('')
      if (addInput.current) addInput.current.value = ''
    }
  }

  const onReplace = async (files: FileList | null) => {
    const idx = replaceIndex.current
    if (!files?.[0] || idx < 0) return
    setMsg(null)
    setUploading('사진 교체 중…')
    try {
      const url = await uploadOne(files[0], v.building)
      setImages((p) => p.map((u, i) => (i === idx ? url : u)))
      touch()
    } catch (e) {
      setMsg({ type: 'err', text: (e as Error).message })
    } finally {
      setUploading('')
      if (replaceInput.current) replaceInput.current.value = ''
    }
  }

  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= images.length) return
    setImages((p) => {
      const n = [...p]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
    touch()
  }

  const removeImage = (i: number) => {
    if (!confirm(`${i + 1}번 사진을 삭제할까요? (저장해야 홈페이지에 반영됩니다)`)) return
    setImages((p) => p.filter((_, k) => k !== i))
    touch()
  }

  const save = () => {
    setMsg(null)
    if (!v.immediate && !v.available_date) {
      setMsg({ type: 'err', text: '입주 가능일을 선택하거나 "즉시 입주"를 체크해 주세요.' })
      return
    }
    startSave(async () => {
      const res = await saveVacancyAction({
        id: isNew ? null : initial.id,
        building: v.building,
        sort_order: Number(v.sort_order),
        floor: v.floor,
        unit: v.unit,
        summary: v.summary,
        area_contract: Number(v.area_contract),
        area_actual: Number(v.area_actual),
        deposit: v.deposit,
        rent: v.rent,
        maintenance: v.maintenance,
        available_date: v.immediate ? null : v.available_date,
        status: v.status,
        tags: v.tagsText.split(',').map((t) => t.trim()).filter(Boolean),
        detail_specs: specs,
        images,
      })
      if (!res.ok) {
        setMsg({ type: 'err', text: res.error })
        return
      }
      setDirty(false)
      setMsg({ type: 'ok', text: '저장되었습니다. 홈페이지에 바로 반영됩니다.' })
      if (isNew) router.replace(`/admin/edit/${res.id}`)
      router.refresh()
    })
  }

  const remove = () => {
    if (!confirm('이 호실을 완전히 삭제할까요?\n홈페이지에서만 숨기려면 상태를 "임대 완료"로 바꾸세요.')) return
    startSave(async () => {
      const res = await deleteVacancyAction(initial.id)
      if (!res.ok) {
        setMsg({ type: 'err', text: res.error })
        return
      }
      setDirty(false)
      router.replace('/admin')
      router.refresh()
    })
  }

  const busy = saving || !!uploading
  const disabled = readOnly || busy

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
    >
      <fieldset disabled={readOnly} className={styles.fieldset}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>상태</h2>
          <div className={styles.segment} role="radiogroup" aria-label="상태">
            {STATUSES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={v.status === s.id}
                className={`${styles.segBtn} ${v.status === s.id ? styles[`seg_${s.id}`] : ''}`}
                onClick={() => set('status', s.id as VacancyStatus)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className={styles.hint}>임대 완료 = 홈페이지에서 숨김 · 계약 진행 중 = 표시하되 공실 개수에서 제외</p>

          <div className={styles.row2}>
            <label className={styles.field}>
              <span>입주 가능일</span>
              <input
                type="date"
                value={v.available_date ?? ''}
                disabled={v.immediate}
                onChange={(e) => set('available_date', e.target.value || null)}
              />
            </label>
            <label className={styles.check}>
              <input type="checkbox" checked={v.immediate} onChange={(e) => set('immediate', e.target.checked)} />
              <span>즉시 입주</span>
            </label>
          </div>
          <p className={styles.hint}>미래 날짜를 지정하면 홈페이지에 &quot;공실 예정&quot;으로 표시되고, 해당 날짜부터 자동으로 현재 공실로 바뀝니다.</p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>호실 · 면적</h2>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>층수</span>
              <input value={v.floor} onChange={(e) => set('floor', e.target.value)} placeholder="예: 4층" maxLength={30} />
            </label>
            <label className={styles.field}>
              <span>호실</span>
              <input value={v.unit} onChange={(e) => set('unit', e.target.value)} placeholder="예: 401호 / 전체" maxLength={30} />
            </label>
          </div>
          <div className={styles.row2}>
            <label className={styles.field}>
              <span>임대 평수</span>
              <input type="number" inputMode="decimal" step="0.01" min="0" value={v.area_contract} onChange={(e) => set('area_contract', e.target.value as unknown as number)} />
            </label>
            <label className={styles.field}>
              <span>실 평수</span>
              <input type="number" inputMode="decimal" step="0.01" min="0" value={v.area_actual} onChange={(e) => set('area_actual', e.target.value as unknown as number)} />
            </label>
          </div>
          <label className={styles.field}>
            <span>한 줄 설명</span>
            <input value={v.summary} onChange={(e) => set('summary', e.target.value)} placeholder="예: 청소 완료 · 바닥·천장 텍스 새로 설치" maxLength={120} />
          </label>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>금액</h2>
          <div className={styles.row3}>
            <label className={styles.field}>
              <span>보증금</span>
              <input value={v.deposit} onChange={(e) => set('deposit', e.target.value)} placeholder="5,000만원" maxLength={30} />
            </label>
            <label className={styles.field}>
              <span>월세</span>
              <input value={v.rent} onChange={(e) => set('rent', e.target.value)} placeholder="250만원" maxLength={30} />
            </label>
            <label className={styles.field}>
              <span>관리비</span>
              <input value={v.maintenance} onChange={(e) => set('maintenance', e.target.value)} placeholder="110만원" maxLength={30} />
            </label>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>사진 ({images.length}장)</h2>
          <p className={styles.hint}>첫 번째 사진이 대표 사진입니다. 변경 후 아래 [저장]을 눌러야 홈페이지에 반영됩니다.</p>
          <div className={styles.photoGrid}>
            {images.map((src, i) => (
              <div key={`${src}-${i}`} className={styles.photo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${i + 1}번 사진`} loading="lazy" />
                <span className={styles.photoNo}>{i === 0 ? '대표' : i + 1}</span>
                <div className={styles.photoBtns}>
                  <button type="button" onClick={() => move(i, -1)} disabled={disabled || i === 0} aria-label="앞으로">◀</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={disabled || i === images.length - 1} aria-label="뒤로">▶</button>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      replaceIndex.current = i
                      replaceInput.current?.click()
                    }}
                  >
                    교체
                  </button>
                  <button type="button" className={styles.danger} onClick={() => removeImage(i)} disabled={disabled}>삭제</button>
                </div>
              </div>
            ))}
            <button type="button" className={styles.photoAdd} onClick={() => addInput.current?.click()} disabled={disabled}>
              + 사진 추가
            </button>
          </div>
          <input ref={addInput} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple hidden onChange={(e) => onAdd(e.target.files)} />
          <input ref={replaceInput} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" hidden onChange={(e) => onReplace(e.target.files)} />
          {uploading && <p className={styles.muted}>{uploading}</p>}
        </div>

        <details className={styles.card}>
          <summary className={styles.cardTitle}>태그 · 상세 정보 · 표시 순서</summary>
          <label className={styles.field}>
            <span>태그 (쉼표로 구분)</span>
            <input value={v.tagsText} onChange={(e) => set('tagsText', e.target.value)} placeholder="즉시 입주 가능, 무료주차 1대" />
          </label>
          <p className={styles.hint}>&quot;즉시 입주 가능&quot; 태그는 입주 가능일·상태에 맞춰 자동으로 바뀌어 표시됩니다.</p>

          <span className={styles.fieldLabel}>상세 정보</span>
          {specs.map((s, i) => (
            <div key={i} className={styles.specRow}>
              <input
                value={s.label}
                placeholder="항목"
                maxLength={30}
                onChange={(e) => {
                  setSpecs((p) => p.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))
                  touch()
                }}
              />
              <input
                value={s.value}
                placeholder="내용"
                maxLength={100}
                onChange={(e) => {
                  setSpecs((p) => p.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)))
                  touch()
                }}
              />
              <button
                type="button"
                className={styles.danger}
                onClick={() => {
                  setSpecs((p) => p.filter((_, k) => k !== i))
                  touch()
                }}
                aria-label="항목 삭제"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.btnSmall}
            onClick={() => {
              setSpecs((p) => [...p, { label: '', value: '' }])
              touch()
            }}
          >
            + 항목 추가
          </button>

          <label className={styles.field}>
            <span>표시 순서 (작을수록 앞)</span>
            <input type="number" inputMode="numeric" value={v.sort_order} onChange={(e) => set('sort_order', e.target.value as unknown as number)} />
          </label>
        </details>
      </fieldset>

      {msg && <p className={msg.type === 'ok' ? styles.okBox : styles.errorBox} role="status">{msg.text}</p>}

      {!readOnly && (
        <div className={styles.saveBar}>
          {!isNew && (
            <button type="button" className={styles.btnDanger} onClick={remove} disabled={busy}>
              삭제
            </button>
          )}
          <button type="submit" className={styles.btnPrimary} disabled={busy}>
            {saving ? '저장 중…' : dirty ? '저장' : '저장됨'}
          </button>
        </div>
      )}
    </form>
  )
}
