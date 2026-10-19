import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'
import AutoSlide from '@/components/AutoSlide/AutoSlide'
import AnimateIn from '@/components/AnimateIn'
import TodayDate from '@/components/TodayDate'
import PhoneLink from '@/components/PhoneLink/PhoneLink'
import { CURRENT_PROPERTIES, UPCOMING_PROPERTIES } from '@/components/sections/PropertySection/PropertySection'
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

const HYOBONG_ENTERPRISE_IMAGES = [
  '/images/hyobong-enterprise/KakaoTalk_20260421_145928118.jpg',
]

const BISAN_IMAGES = [
  '/images/bisan/KakaoTalk_20260421_150637700.jpg',
  '/images/bisan/KakaoTalk_20260421_150637700_01.jpg',
  '/images/bisan/KakaoTalk_20260421_150637700_02.jpg',
  '/images/bisan/KakaoTalk_20260421_150637700_03.jpg',
]

// 루틴: 효봉8빌딩 공실 수는 PropertySection의 PROPERTIES에서 자동 계산됩니다.
// 비산효봉·효봉기업 빌딩은 각 페이지(bisan, hyobong-enterprise)의 공실 수와 맞춰 아래 숫자를 수정하세요.
// 메인 상단 공실 합계(heroSub)는 아래 vacancyCount·upcomingCount 합계로 자동 계산됩니다.
const BUILDINGS = [
  {
    id: 'hyobong8',
    name: '효봉8빌딩',
    location: '서초동 · 남부터미널역 도보 5분',
    vacancyCount: CURRENT_PROPERTIES.length,
    upcomingCount: UPCOMING_PROPERTIES.length,
    status: '즉시 입주 가능',
    href: '/hyobong8',
    hasSlide: true,
    tags: ['역세권', '넓은 주차', '사무실·상가 가능'],
  },
  {
    id: 'bisan',
    name: '비산효봉',
    location: '안양 비산동',
    vacancyCount: 1,
    upcomingCount: 0,
    status: '빠른 계약 가능',
    href: '/bisan',
    hasSlide: true,
    tags: ['즉시 입주', '조건 협의 가능'],
  },
  {
    id: 'hyobong-enterprise',
    name: '효봉기업',
    location: '서초동 · 양재역 도보 5분',
    vacancyCount: 1,
    upcomingCount: 0,
    status: '즉시 입주 가능',
    href: '/hyobong-enterprise',
    hasSlide: true,
    tags: ['즉시 입주', '무료주차 1대', '사무실 가능'],
  },
]

const TOTAL_VACANCIES = BUILDINGS.reduce((sum, b) => sum + b.vacancyCount, 0)
const TOTAL_UPCOMING = BUILDINGS.reduce((sum, b) => sum + b.upcomingCount, 0)

const INFO_ITEMS = [
  { icon: '📍', label: '남부터미널 / 안양 비산동 / 양재역' },
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
          <div className={styles.heroBg} aria-hidden="true">
            <Image
              src="/images/building/KakaoTalk_20260417_164505696_01_hero.jpg"
              alt="효봉기업 건물 외관"
              fill
              priority
              quality={95}
              className={styles.heroBgImg}
              sizes="100vw"
            />
          </div>
          <div className={styles.heroOverlay} aria-hidden="true" />

          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>서초동 남부터미널역 · 양재역 사무실 임대</div>
            <h1 className={styles.heroTitle}>지금 바로 입주 가능한 사무실·상가</h1>
            <p className={styles.heroSub}>
              공실 {TOTAL_VACANCIES}개 보유
              {TOTAL_UPCOMING > 0 && ` · 공실 예정 ${TOTAL_UPCOMING}개`} / 빠른 계약 가능
            </p>
            <PhoneLink className={styles.heroPhone} location="home_hero" phone={PHONE}>
              <PhoneIcon />
              {PHONE} 바로 전화
            </PhoneLink>
          </div>
        </section>

        {/* ── Buildings ── */}
        <section className={styles.buildingsSection}>
          <div className={styles.buildingsContainer}>
            <AnimateIn className="reveal" activeClassName="inView">
              <div className={styles.sectionHead}>
                <span className={styles.sectionLabel}>건물 선택</span>
                <h2 className={styles.sectionTitle}>임대 건물을 선택하세요</h2>
                <p className={styles.sectionDesc}>세 건물 모두 즉시 입주 가능 · 조건 협의 환영</p>
                <p className={styles.updateDate}><TodayDate /></p>
              </div>
            </AnimateIn>

            <AnimateIn className="reveal" activeClassName="inView" threshold={0.08}>
            <div className={styles.buildingGrid}>
              {BUILDINGS.map((b) => (
                <Link key={b.id} href={b.href} className={styles.buildingCard}>
                  {b.hasSlide && (
                    <div className={styles.cardImageWrap}>
                      <AutoSlide
                        images={
                          b.id === 'hyobong-enterprise' ? HYOBONG_ENTERPRISE_IMAGES :
                          b.id === 'bisan' ? BISAN_IMAGES :
                          HYOBONG8_IMAGES
                        }
                        alt={`${b.name} 건물`}
                        interval={3500}
                      />
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
                      <span className={styles.vacancyCount}>
                        현재 공실 {b.vacancyCount}개
                        {b.upcomingCount > 0 && ` · 공실 예정 ${b.upcomingCount}개`}
                      </span>
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
            </AnimateIn>

            {/* ── 아이콘 정보 바 ── */}
            <AnimateIn className="reveal" activeClassName="inView">
              <div className={styles.infoBar}>
                {INFO_ITEMS.map((item) => (
                  <div key={item.label} className={styles.infoItem}>
                    <span className={styles.infoIcon}>{item.icon}</span>
                    <span className={styles.infoLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>

            <AnimateIn className="revealScale" activeClassName="inView">
              <div className={styles.bottomCta}>
                <p className={styles.bottomCtaTitle}>어떤 건물이든 바로 문의하세요</p>
                <p className={styles.bottomCtaSub}>전화 한 통으로 모든 조건을 바로 안내해 드립니다</p>
                <PhoneLink className={styles.bottomPhoneBtn} location="home_bottom_cta" phone={PHONE}>
                  <PhoneIcon />
                  {PHONE} 전화 문의
                </PhoneLink>
              </div>
            </AnimateIn>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
