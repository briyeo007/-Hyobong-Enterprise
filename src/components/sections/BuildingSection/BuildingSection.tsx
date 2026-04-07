import AnimateIn from '@/components/AnimateIn'
import styles from './BuildingSection.module.scss'

const SPECS = [
  { label: '건물 용도', value: '업무용 오피스' },
  { label: '총 층수',   value: '지상 1층 ~ 5층' },
  { label: '준공연도',  value: '정보 입력 예정' },
  { label: '총 면적',   value: '정보 입력 예정' },
  { label: '주차 규모', value: '정보 입력 예정' },
  { label: '엘리베이터', value: '정보 입력 예정' },
]

const FACILITIES = [
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>, label: '엘리베이터', desc: '24시간 운행' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: '주차장', desc: '입주자 전용 주차 공간' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.08 2.18 2 2 0 012.07 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l.41-.41a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>, label: '관리실', desc: '평일 상주 관리' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: '보안 시스템', desc: 'CCTV 및 출입 통제' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label: '인터넷', desc: '초고속 광랜 입주' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: '청결한 공용부', desc: '매일 청소 관리' },
]

export default function BuildingSection() {
  return (
    <section id="building" className={styles.section}>
      <div className={styles.container}>
        <AnimateIn className={styles.header} activeClassName={styles.inView}>
          <span className={styles.label}>빌딩소개</span>
          <h2 className={styles.title}>효봉8빌딩 소개</h2>
          <p className={styles.desc}>
            우수한 관리 상태와 최적의 접근성을 갖춘
            <br />
            효봉8빌딩에서 최고의 업무 환경을 경험하세요.
          </p>
        </AnimateIn>

        <div className={styles.overview}>
          <AnimateIn className={styles.photoGrid} activeClassName={styles.inView} threshold={0.1}>
            <div className={`${styles.photoItem} ${styles.photoMain}`}>
              <div className={styles.photoPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>빌딩 외관 사진</p>
              </div>
            </div>
            <div className={styles.photoItem}>
              <div className={styles.photoPlaceholder}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>내부 사진</p>
              </div>
            </div>
            <div className={styles.photoItem}>
              <div className={styles.photoPlaceholder}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <p>로비 사진</p>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn className={styles.specsWrap} activeClassName={styles.inView} threshold={0.1}>
            <h3 className={styles.specsTitle}>건물 개요</h3>
            <dl className={styles.specsList}>
              {SPECS.map((s) => (
                <div key={s.label} className={styles.specItem}>
                  <dt className={styles.specLabel}>{s.label}</dt>
                  <dd className={styles.specValue}>{s.value}</dd>
                </div>
              ))}
            </dl>
            <a href="tel:02-3473-6651" className={styles.cta}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
              입주 문의 바로 전화
            </a>
          </AnimateIn>
        </div>

        <AnimateIn className={styles.facilitiesWrap} activeClassName={styles.inView} threshold={0.1}>
          <h3 className={styles.facilitiesTitle}>주요 시설</h3>
          <div className={styles.facilitiesGrid}>
            {FACILITIES.map((f, i) => (
              <div key={f.label} className={styles.facilityCard} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className={styles.facilityIcon}>{f.icon}</div>
                <p className={styles.facilityLabel}>{f.label}</p>
                <p className={styles.facilityDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  )
}
