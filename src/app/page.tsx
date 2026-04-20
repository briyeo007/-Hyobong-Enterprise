import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'
import AutoSlide from '@/components/AutoSlide/AutoSlide'
import styles from './page.module.scss'

const PHONE = '02-3473-6651'

const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const HYOBONG8_IMAGES = [
  '/images/building/KakaoTalk_20260417_164505696.jpg',
  '/images/building/KakaoTalk_20260417_164505696_01.jpg',
]

const BUILDINGS = [
  {
    id: 'hyobong8',
    name: '효봉8빌딩',
    location: '남부터미널 (서초구)',
    vacancies: '현재 공실 4개',
    status: '즉시 입주 가능',
    href: '/hyobong8',
    hasSlide: true,
    tags: ['역세권', '넓은 주차', '사무실·상가 가능'],
  },
  {
    id: 'bisan',
    name: '비산효봉',
    location: '안양 비산동',
    vacancies: '현재 공실 1개',
    status: '빠른 계약 가능',
    href: '/bisan',
    hasSlide: false,
    tags: ['즉시 입주', '조건 협의 가능'],
  },
]

const INFO_ITEMS = [
  { icon: '📍', label: '남부터미널 / 안양 비산동' },
  { icon: '🏢', label: '사무실·상가 가능' },
  { icon: '⚡', label: '즉시 입주 가능' },
]

export default function MainPage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true" />
          <div className={styles.heroOverlay} aria-hidden="true" />

          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>공실 확인 · 즉시 안내 가능</div>
            <h1 className={styles.heroTitle}>지금 바로 입주 가능한<br />사무실·상가</h1>
            <p className={styles.heroSub}>공실 5개 보유 / 빠른 계약 가능</p>
            <a href={`tel:${PHONE}`} className={styles.heroPhone}>
              <PhoneIcon />
              {PHONE} 바로 전화
            </a>
          </div>
        </section>

        {/* ── Buildings ── */}
        <section className={styles.buildingsSection}>
          <div className={styles.buildingsContainer}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionLabel}>건물 선택</span>
              <h2 className={styles.sectionTitle}>임대 건물을 선택하세요</h2>
              <p className={styles.sectionDesc}>두 건물 모두 즉시 입주 가능 · 조건 협의 환영</p>
            </div>

            <div className={styles.buildingGrid}>
              {BUILDINGS.map((b) => (
                <Link key={b.id} href={b.href} className={styles.buildingCard}>
                  {/* 효봉8빌딩: 자동 슬라이드 / 비산: 이미지 없음 */}
                  {b.hasSlide && (
                    <div className={styles.cardImageWrap}>
                      <AutoSlide images={HYOBONG8_IMAGES} alt={b.name} interval={3500} />
                      <div className={styles.cardImageBadge}>
                        <span className={styles.cardDot} />
                        {b.status}
                      </div>
                    </div>
                  )}

                  {/* 본문 */}
                  <div className={styles.cardBody}>
                    {!b.hasSlide && (
                      <div className={styles.cardImageBadgeInline}>
                        <span className={styles.cardDot} />
                        {b.status}
                      </div>
                    )}
                    <p className={styles.cardLocation}>{b.location}</p>
                    <p className={styles.cardName}>{b.name}</p>

                    <div className={styles.cardVacancy}>
                      <span className={styles.vacancyCount}>{b.vacancies}</span>
                      <span className={styles.vacancyStatus}>{b.status}</span>
                    </div>

                    <div className={styles.cardTags}>
                      {b.tags.map((t) => (
                        <span key={t} className={styles.cardTag}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.cardCta}>
                    공실 상세 보기
                    <ArrowIcon />
                  </div>
                </Link>
              ))}
            </div>

            {/* ── 아이콘 정보 바 ── */}
            <div className={styles.infoBar}>
              {INFO_ITEMS.map((item) => (
                <div key={item.label} className={styles.infoItem}>
                  <span className={styles.infoIcon}>{item.icon}</span>
                  <span className={styles.infoLabel}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.bottomCta}>
              <p className={styles.bottomCtaTitle}>어떤 건물이든 바로 문의하세요</p>
              <p className={styles.bottomCtaSub}>전화 한 통으로 모든 조건을 바로 안내해 드립니다</p>
              <a href={`tel:${PHONE}`} className={styles.bottomPhoneBtn}>
                <PhoneIcon />
                {PHONE} 전화 문의
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
