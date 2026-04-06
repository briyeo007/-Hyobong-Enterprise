'use client'

import { useInView } from '@/hooks/useInView'
import styles from './PropertySection.module.scss'

const PROPERTY = {
  floor: '층수 입력',
  area: '평수 입력',
  areaM2: '㎡ 입력',
  price: '월세 문의',
  deposit: '보증금 문의',
  description: '간단한 설명을 입력해 주세요.',
  tags: ['즉시 입주 가능'],
}

export default function PropertySection() {
  const { ref: headerRef, inView: headerIn } = useInView()
  const { ref: cardRef,   inView: cardIn   } = useInView(0.15)

  return (
    <section id="property" className={styles.section}>
      <div className={styles.container}>
        <div
          ref={headerRef}
          className={`${styles.header} ${headerIn ? styles.inView : ''}`}
        >
          <span className={styles.label}>매물정보</span>
          <h2 className={styles.title}>현재 공실 현황</h2>
          <p className={styles.desc}>
            효봉8빌딩의 임대 가능한 공실입니다.
            자세한 조건은 전화 문의를 통해 확인하세요.
          </p>
        </div>

        <div
          ref={cardRef}
          className={`${styles.card} ${cardIn ? styles.cardVisible : ''}`}
        >
          <div className={styles.cardHeader}>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} />
              즉시 입주 가능
            </div>
            <span className={styles.floor}>{PROPERTY.floor}</span>
          </div>

          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>전용 면적</span>
              <span className={styles.specValue}>{PROPERTY.area}</span>
              <span className={styles.specSub}>{PROPERTY.areaM2}</span>
            </div>
            <div className={styles.specDivider} />
            <div className={styles.specItem}>
              <span className={styles.specLabel}>보증금</span>
              <span className={styles.specValue}>{PROPERTY.deposit}</span>
            </div>
            <div className={styles.specDivider} />
            <div className={styles.specItem}>
              <span className={styles.specLabel}>월 임대료</span>
              <span className={styles.specValue}>{PROPERTY.price}</span>
            </div>
          </div>

          <p className={styles.description}>{PROPERTY.description}</p>

          <div className={styles.tags}>
            {PROPERTY.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          <a href="tel:02-3473-6651" className={styles.cta}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            이 매물 문의하기 · 02-3473-6651
          </a>
        </div>

        <p className={styles.notice}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          가격 및 조건은 협의 가능합니다.
        </p>
      </div>
    </section>
  )
}
