import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'
import PropertySection, { PROPERTIES } from '@/components/sections/PropertySection/PropertySection'
import LocationSection from '@/components/sections/LocationSection/LocationSection'
import AnimateIn from '@/components/AnimateIn'
import PhoneLink from '@/components/PhoneLink/PhoneLink'
import styles from './page.module.scss'

// 공실 목록(PROPERTIES)에서 공실 수·평수 범위를 계산해 description에 자동 반영합니다.
const CONTRACT_AREAS = PROPERTIES.map((p) => p.area.contract)
const VACANCY_SUMMARY = `사무실 공실 ${PROPERTIES.length}개(${PROPERTIES.map((p) => p.floor).join('·')}), 임대 ${Math.min(...CONTRACT_AREAS)}~${Math.max(...CONTRACT_AREAS)}평`

export const metadata: Metadata = {
  title: '남부터미널역 사무실 임대 | 서초동 효봉8빌딩 공실 안내',
  description: `서울 서초구 서초동 3호선 남부터미널역 도보 5분 효봉8빌딩. ${VACANCY_SUMMARY}, 주차 가능. 문의: 02-3473-6651`,
  keywords: ['남부터미널역 사무실 임대', '남부터미널 사무실 임대', '서초동 사무실 임대', '서초동 상가 임대', '서초구 사무실 임대', '남부터미널역 상가 임대', '효봉8빌딩'],
  alternates: { canonical: '/hyobong8' },
  openGraph: {
    type: 'website',
    url: '/hyobong8',
    siteName: '효봉기업',
    locale: 'ko_KR',
    title: '남부터미널역 사무실 임대 | 서초동 효봉8빌딩',
    description: '서초동 남부터미널역 도보 5분 사무실·상가 임대. 즉시 입주 가능. 문의: 02-3473-6651',
    images: ['/images/building/KakaoTalk_20260417_164505696.jpg'],
  },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: '효봉8빌딩',
  description: `서울 서초구 서초동, 3호선 남부터미널역 4-1번 출구 도보 약 5분(374m). ${VACANCY_SUMMARY}`,
  url: 'https://www.hyobongkiup.com/hyobong8',
  image: 'https://www.hyobongkiup.com/images/building/KakaoTalk_20260417_164505696.jpg',
  telephone: '+82-2-3473-6651',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '남부순환로333길 13',
    addressLocality: '서초구',
    addressRegion: '서울특별시',
    addressCountry: 'KR',
  },
}

const PHONE = '02-3473-6651'

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const SUMMARY_ITEMS = [
  '남부터미널역 도보 5분 (역세권)',
  '입주자 전용 주차 완비',
  '전문 관리팀 상주',
  '엘리베이터 완비',
]

export default function Hyobong8Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Header />
      <main>
        {/* ── Building Header ── */}
        <section className={styles.pageHeader}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              건물 선택으로 돌아가기
            </Link>

            {/* 루틴: 공실 수는 PropertySection의 PROPERTIES 배열 길이로 자동 반영됩니다 */}
            <div className={styles.headerBadge}>
              <span className={styles.headerDot} />
              현재 공실 {PROPERTIES.length}개 · 즉시 입주 가능
            </div>

            <h1 className={styles.headerTitle}>효봉8빌딩</h1>
            <p className={styles.headerLocation}>서울 서초구 서초동 남부순환로333길 13 · 남부터미널역 도보 5분</p>

            <div className={styles.headerPhoneRow}>
              <PhoneLink className={styles.headerPhone} location="hyobong8_header" phone={PHONE}>
                <PhoneIcon />
                {PHONE} 전화 문의
              </PhoneLink>
              <span className={styles.headerInfo}>가격·조건 협의 가능 · 빠른 안내</span>
            </div>
          </div>
        </section>

        {/* ── Summary Bar ── */}
        <AnimateIn className="reveal" activeClassName="inView">
          <div className={styles.summaryBar}>
            <div className={styles.summaryInner}>
              {SUMMARY_ITEMS.map((item) => (
                <div key={item} className={styles.summaryItem}>
                  <CheckIcon />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        {/* ── Vacancies ── */}
        <PropertySection />

        {/* ── Location ── */}
        <LocationSection showCta={false} />

        {/* ── Bottom CTA ── */}
        <div style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <AnimateIn className="revealScale" activeClassName="inView">
              <div className={styles.bottomCta}>
                <p className={styles.bottomCtaTitle}>공실 확인 후 바로 문의하세요</p>
                <p className={styles.bottomCtaSub}>전화 한 통으로 모든 조건을 바로 안내해 드립니다</p>
                <PhoneLink className={styles.bottomPhoneBtn} location="hyobong8_bottom_cta" phone={PHONE}>
                  <PhoneIcon />
                  {PHONE} 전화 문의
                </PhoneLink>
              </div>
            </AnimateIn>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
