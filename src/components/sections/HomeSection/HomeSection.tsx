import styles from './HomeSection.module.scss'

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
    title: '역세권',
    desc: '지하철역 도보 이동 가능한 최적의 위치',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: '넓은 주차',
    desc: '입주자 전용 넓은 주차 공간 완비',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: '관리 상태 우수',
    desc: '전문 관리팀 상주로 청결하고 쾌적한 환경',
  },
]

export default function HomeSection() {
  return (
    <section id="home" className={styles.section}>
      {/* 배경 이미지 영역 — 실제 사진으로 교체하세요 */}
      <div className={styles.bg} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.badge}>서초동 공실 문의 · 빠른 입주 가능</div>

        <h1 className={styles.title}>
          효봉8빌딩 사무실 임대
        </h1>

        <p className={styles.subtitle}>
          현재 공실 즉시 안내 / 빠른 입주 가능
          <br />
          <strong className={styles.subtitleAccent}>지금 문의하시면 바로 연결됩니다</strong>
        </p>

        <div className={styles.features}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div>
                <p className={styles.featureTitle}>{f.title}</p>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <a href="tel:02-3473-6651" className={styles.btnPrimary}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            전화하기
          </a>
          <a href="#contact" className={styles.btnOutline}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            지금 공실 문의하기
          </a>
        </div>
      </div>

      <a
        href="#property"
        className={styles.scrollDown}
        aria-label="아래로 스크롤"
      >
        <span />
      </a>
    </section>
  )
}
