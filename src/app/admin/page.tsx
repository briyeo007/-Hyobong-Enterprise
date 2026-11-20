import Link from 'next/link'
import { listForAdmin, storeMode } from '@/lib/vacancy-store'
import { BUILDINGS, STATUSES, groupForSite, sortRows, toProperty, unitLabel } from '@/lib/vacancy-types'
import { logoutAction } from './actions'
import StatusQuick from './StatusQuick'
import styles from './admin.module.scss'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const mode = storeMode()
  let rows: Awaited<ReturnType<typeof listForAdmin>> = []
  let loadError = ''
  try {
    rows = await listForAdmin()
  } catch (e) {
    console.error('[admin] load failed', e)
    loadError = '공실 데이터를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.'
  }
  const site = groupForSite(rows)

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.topTitle}>공실 관리</h1>
        <div className={styles.topActions}>
          <a href="/" target="_blank" rel="noopener" className={styles.btnGhost}>홈페이지 보기</a>
          <form action={logoutAction}>
            <button type="submit" className={styles.btnGhost}>로그아웃</button>
          </form>
        </div>
      </header>

      {mode === 'seed' && (
        <p className={styles.warnBox}>
          저장소(Supabase)가 아직 연결되지 않았습니다. 현재 홈페이지 데이터를 읽기 전용으로 보여주고 있으며 수정·저장은 할 수 없습니다.
        </p>
      )}
      {mode === 'local' && <p className={styles.warnBox}>로컬 테스트 저장소 모드입니다 (운영 데이터 아님).</p>}
      {loadError && <p className={styles.errorBox}>{loadError}</p>}

      {BUILDINGS.map((b) => {
        const list = sortRows(rows.filter((r) => r.building === b.id))
        const s = site[b.id]
        return (
          <section key={b.id} className={styles.building}>
            <div className={styles.buildingHead}>
              <div>
                <h2 className={styles.buildingName}>{b.name}</h2>
                <p className={styles.muted}>
                  홈페이지 표시: 현재 공실 {s.current.length}개
                  {s.upcoming.length > 0 && ` · 공실 예정 ${s.upcoming.length}개`}
                </p>
              </div>
              {mode !== 'seed' && (
                <Link href={`/admin/new?building=${b.id}`} className={styles.btnSmall}>+ 공실 추가</Link>
              )}
            </div>

            {list.length === 0 && <p className={styles.muted}>등록된 호실이 없습니다.</p>}

            <ul className={styles.list}>
              {list.map((r) => {
                const p = toProperty(r)
                return (
                  <li key={r.id} className={`${styles.item} ${r.status === 'leased' ? styles.itemLeased : ''}`}>
                    <Link href={`/admin/edit/${r.id}`} className={styles.itemMain}>
                      <div className={styles.thumb}>
                        {r.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.images[0]} alt="" loading="lazy" />
                        ) : (
                          <span>사진 없음</span>
                        )}
                      </div>
                      <div className={styles.itemText}>
                        <strong>{unitLabel(r)}</strong>
                        <span className={styles.muted}>
                          {r.area_contract}평(실 {r.area_actual}평) · {r.deposit} / {r.rent} / 관리비 {r.maintenance}
                        </span>
                        <span className={styles.muted}>
                          {r.status === 'leased' ? '홈페이지 미표시' : p.urgency.replace('✔ ', '')} · 사진 {r.images.length}장
                        </span>
                      </div>
                    </Link>
                    <StatusQuick row={r} disabled={mode === 'seed'} statuses={STATUSES.map((s) => ({ ...s }))} />
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </main>
  )
}
