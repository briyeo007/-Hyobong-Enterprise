import AnimateIn from '@/components/AnimateIn'
import PropertyImageCarousel from './PropertyImageCarousel'
import TodayDate from '@/components/TodayDate'
import PhoneLink from '@/components/PhoneLink/PhoneLink'
import type { Property } from '@/lib/vacancy-types'
import styles from './PropertySection.module.scss'

export type { Property }

// 공실 데이터는 관리자 페이지(/admin)에서 수정하며, 건물 페이지가 조회해 properties로 전달합니다.
export default function PropertySection({ properties }: { properties: Property[] }) {
  return (
    <section id="property" className={styles.section}>
      <div className={styles.container}>
        <AnimateIn className={styles.header} activeClassName={styles.inView}>
          <span className={styles.label}>매물정보</span>
          <h2 className={styles.title}>현재 공실 현황</h2>
          <p className={styles.desc}>
            서초동 사무실 임대를 찾고 계신다면 3호선 남부터미널역 4-1번 출구에서 도보 약 5분 거리인
            효봉8빌딩의 공실을 확인해 보세요. 입주자 전용 주차와 엘리베이터를 갖추고 있으며,
            자세한 조건은 전화 문의를 통해 안내해 드립니다.
          </p>
        </AnimateIn>

        <p className={styles.notice}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          가격 및 조건은 협의 가능합니다.
          <span className={styles.noticeSep}>·</span>
          <TodayDate className={styles.noticeDate} />
        </p>

        <PhoneLink className={styles.phoneCta} location="property_section_notice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
          공실 문의는 전화로 바로 연결됩니다 · <strong>02-3473-6651</strong>
        </PhoneLink>

        <div className={styles.grid}>
          {properties.map((p, idx) => (
            <AnimateIn
              key={p.id}
              className={styles.card}
              activeClassName={styles.cardVisible}
              style={{ transitionDelay: `${idx * 0.12}s` }}
            >
              <div className={styles.imageWrap}>
                <PropertyImageCarousel images={p.images} alt={`효봉8빌딩 ${p.floor} 사무실`} />
                {p.urgency && (
                  <span className={`${styles.urgencyBadge}${p.upcoming ? ` ${styles.urgencyBadgeUpcoming}` : ''}`}>
                    {p.urgency}
                  </span>
                )}
              </div>
              <div className={styles.cardHeader}>
                <div className={styles.statusBadge}>
                  <span className={`${styles.statusDot}${p.upcoming ? ` ${styles.statusDotUpcoming}` : ''}`} />
                  {p.urgency ? p.urgency.replace('✔ ', '') : '즉시 입주 가능'}
                </div>
                <span className={styles.floor}>{p.floor}</span>
              </div>
              <p className={styles.summary}>{p.summary}</p>

              {/* 면적 공통 */}
              <div className={styles.areaRow}>
                <div className={styles.areaItem}>
                  <span className={styles.areaLabel}>임대 평수</span>
                  <span className={styles.areaValue}>{p.area.contract}평</span>
                </div>
                <div className={styles.areaDivider} />
                <div className={styles.areaItem}>
                  <span className={styles.areaLabel}>실 평수</span>
                  <span className={styles.areaValue}>{p.area.actual}평</span>
                </div>
              </div>

              {/* 단일 조건 */}
              {(
                <div className={styles.specGrid}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>보증금</span>
                    <span className={styles.specValue}>{p.deposit}</span>
                  </div>
                  <div className={styles.specDivider} />
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>월 임대료</span>
                    <span className={styles.specValue}>{p.rent}</span>
                  </div>
                  <div className={styles.specDivider} />
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>관리비</span>
                    <span className={styles.specValue}>{p.maintenance}</span>
                  </div>
                </div>
              )}

              {p.detailSpecs && p.detailSpecs.length > 0 && (
                <div className={styles.detailTable}>
                  <p className={styles.detailTableTitle}>상세 정보</p>
                  <table className={styles.table}>
                    <tbody>
                      {p.detailSpecs.map((row) => (
                        <tr key={row.label} className={styles.tableRow}>
                          <th className={styles.tableTh}>{row.label}</th>
                          <td className={styles.tableTd}>{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className={styles.tags}>
                {p.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>

              <PhoneLink className={styles.cta} location="property_section_card" unit={p.floor}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                </svg>
                문의하기 · 02-3473-6651
              </PhoneLink>
            </AnimateIn>
          ))}
        </div>

      </div>
    </section>
  )
}
