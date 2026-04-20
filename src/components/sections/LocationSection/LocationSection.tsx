import AnimateIn from '@/components/AnimateIn'
import SectionCTA from '@/components/SectionCTA/SectionCTA'
import styles from './LocationSection.module.scss'

interface AccessPoint {
  icon: React.ReactNode
  category: string
  items: string[]
}

interface LocationProps {
  description?: string
  googleMapsQuery?: string
  naverMapUrl: string
  address: string
  accessPoints?: AccessPoint[]
  showCta?: boolean
}

const HYOBONG8_ACCESS: AccessPoint[] = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
    category: '지하철',
    items: ['3호선 남부터미널역 4-1번 출구 도보 374m (약 5분)'],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    category: '버스',
    items: ['남부순환로 경유 간선·지선버스 이용 가능'],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    category: '주변 상권',
    items: ['서초구 주요 상권 및 편의시설 인접', '은행 · 카페 · 편의점 도보 이용 가능'],
  },
]

const DEFAULT_PROPS: LocationProps = {
  description: '3호선 남부터미널역 도보 5분, 서초구 핵심 업무지역에 위치합니다.',
  googleMapsQuery: '서울+서초구+남부순환로333길+13',
  naverMapUrl: 'https://naver.me/xmxY78A9',
  address: '서울 서초구 남부순환로333길 13\n효봉빌딩',
  accessPoints: HYOBONG8_ACCESS,
  showCta: true,
}

export default function LocationSection(props: Partial<LocationProps> = {}) {
  const {
    description,
    googleMapsQuery,
    naverMapUrl,
    address,
    accessPoints,
    showCta,
  } = { ...DEFAULT_PROPS, ...props }

  return (
    <section id="location" className={styles.section}>
      <div className={styles.container}>
        <AnimateIn className={styles.header} activeClassName={styles.inView}>
          <span className={styles.label}>입지/위치</span>
          <h2 className={styles.title}>최적의 입지</h2>
          {description && <p className={styles.desc}>{description}</p>}
        </AnimateIn>

        <div className={styles.layout}>
          <AnimateIn className={styles.mapWrap} activeClassName={styles.inView} threshold={0.1}>
            {googleMapsQuery ? (
              <iframe
                src={`https://maps.google.com/maps?q=${googleMapsQuery}&t=&z=17&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="건물 위치"
              />
            ) : (
              <div className={styles.mapPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <p className={styles.mapPlaceholderTitle}>지도 보기</p>
                <p className={styles.mapPlaceholderDesc}>네이버 지도에서 정확한 위치를 확인하세요</p>
                <a
                  href={naverMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mapLink}
                >
                  네이버 지도 바로가기
                </a>
              </div>
            )}
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.naverBtn}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              네이버 지도에서 정확한 위치 보기
            </a>
          </AnimateIn>

          <AnimateIn className={styles.infoWrap} activeClassName={styles.inView} threshold={0.1}>
            <div className={styles.addressCard}>
              <div className={styles.addressIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className={styles.addressLabel}>주소</p>
                <p className={styles.addressValue}>
                  {address.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < address.split('\n').length - 1 && <br />}</span>
                  ))}
                </p>
              </div>
            </div>

            {accessPoints && accessPoints.length > 0 && (
              <div className={styles.accessList}>
                {accessPoints.map((ap, i) => (
                  <div key={ap.category} className={styles.accessCard} style={{ transitionDelay: `${i * 0.1 + 0.15}s` }}>
                    <div className={styles.accessHeader}>
                      <div className={styles.accessIcon}>{ap.icon}</div>
                      <span className={styles.accessCategory}>{ap.category}</span>
                    </div>
                    <ul className={styles.accessItems}>
                      {ap.items.map((item) => (
                        <li key={item} className={styles.accessItem}>
                          <span className={styles.accessDot} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <a href="tel:02-3473-6651" className={styles.cta}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
              위치 확인 후 전화 문의
            </a>

            {showCta && <SectionCTA />}
          </AnimateIn>
        </div>
      </div>
    </section>
  )
}
