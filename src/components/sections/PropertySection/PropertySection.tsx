import SectionCTA from '@/components/SectionCTA/SectionCTA'
import styles from './PropertySection.module.scss'

type SingleProperty = {
  id: string
  floor: string
  area: { contract: number; actual: number }
  deposit: string
  rent: string
  maintenance: string
  tags: string[]
  dual?: false
}

type DualProperty = {
  id: string
  floor: string
  area: { contract: number; actual: number }
  dual: true
  options: { label: string; deposit: string; rent: string; maintenance: string }[]
  tags: string[]
}

type Property = SingleProperty | DualProperty

const PROPERTIES: Property[] = [
  {
    id: '1f-102',
    floor: '1층 102호',
    area: { contract: 66, actual: 40 },
    dual: true,
    options: [
      { label: '사무실', deposit: '5,000만원', rent: '600만원', maintenance: '118.8만원' },
      { label: '가게', deposit: '1억원', rent: '600만원', maintenance: '132만원' },
    ],
    tags: ['즉시 입주 가능', '사무실 / 가게 선택'],
  },
  {
    id: '2f-201',
    floor: '2층 201호',
    area: { contract: 55, actual: 34 },
    deposit: '3,000만원',
    rent: '250만원',
    maintenance: '110만원',
    tags: ['즉시 입주 가능'],
  },
  {
    id: '3f-all',
    floor: '3층 전체',
    area: { contract: 110, actual: 70 },
    deposit: '1억원',
    rent: '700만원',
    maintenance: '200만원',
    tags: ['즉시 입주 가능', '전층 단독 사용'],
  },
  {
    id: '5f-501',
    floor: '5층 501호',
    area: { contract: 55, actual: 34 },
    deposit: '5,000만원',
    rent: '400만원',
    maintenance: '110만원',
    tags: ['즉시 입주 가능'],
  },
]

export default function PropertySection() {
  return (
    <section id="property" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>매물정보</span>
          <h2 className={styles.title}>현재 공실 현황</h2>
          <p className={styles.desc}>
            효봉8빌딩의 임대 가능한 공실입니다.
            자세한 조건은 전화 문의를 통해 확인하세요.
          </p>
        </div>

        <div className={styles.grid}>
          {PROPERTIES.map((p) => (
            <div key={p.id} className={`${styles.card} ${styles.cardVisible}`}>
              <div className={styles.cardHeader}>
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot} />
                  즉시 입주 가능
                </div>
                <span className={styles.floor}>{p.floor}</span>
              </div>

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
              {!p.dual && (
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

              {/* 이중 조건 (사무실/가게) */}
              {p.dual && (
                <div className={styles.dualGrid}>
                  {p.options.map((opt) => (
                    <div key={opt.label} className={styles.dualOption}>
                      <span className={styles.dualLabel}>{opt.label}</span>
                      <div className={styles.dualSpecs}>
                        <div className={styles.dualSpecItem}>
                          <span className={styles.specLabel}>보증금</span>
                          <span className={styles.dualValue}>{opt.deposit}</span>
                        </div>
                        <div className={styles.dualSpecItem}>
                          <span className={styles.specLabel}>월 임대료</span>
                          <span className={styles.dualValue}>{opt.rent}</span>
                        </div>
                        <div className={styles.dualSpecItem}>
                          <span className={styles.specLabel}>관리비</span>
                          <span className={styles.dualValue}>{opt.maintenance}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.tags}>
                {p.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>

              <a href="tel:02-3473-6651" className={styles.cta}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                </svg>
                문의하기 · 02-3473-6651
              </a>
            </div>
          ))}
        </div>

        <p className={styles.notice}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          가격 및 조건은 협의 가능합니다.
        </p>
        <SectionCTA />
      </div>
    </section>
  )
}
