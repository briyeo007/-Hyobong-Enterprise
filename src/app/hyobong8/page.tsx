import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'
import PropertySection from '@/components/sections/PropertySection/PropertySection'
import LocationSection from '@/components/sections/LocationSection/LocationSection'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: '효봉8빌딩 공실 안내 | 남부터미널 사무실·상가 임대',
  description: '서울 서초구 남부터미널역 도보 5분. 현재 공실 4개 즉시 입주 가능. 사무실·상가 임대 문의: 02-3473-6651',
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

            <div className={styles.headerBadge}>
              <span className={styles.headerDot} />
              현재 공실 4개 · 즉시 입주 가능
            </div>

            <h1 className={styles.headerTitle}>효봉8빌딩</h1>
            <p className={styles.headerLocation}>서울 서초구 남부순환로333길 13 · 남부터미널역 도보 5분</p>

            <div className={styles.headerPhoneRow}>
              <a href={`tel:${PHONE}`} className={styles.headerPhone}>
                <PhoneIcon />
                {PHONE} 전화 문의
              </a>
              <span className={styles.headerInfo}>가격·조건 협의 가능 · 빠른 안내</span>
            </div>
          </div>
        </section>

        {/* ── Summary Bar ── */}
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

        {/* ── Vacancies ── */}
        <PropertySection />

        {/* ── Location ── */}
        <LocationSection />

        {/* ── Bottom CTA ── */}
        <div style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className={styles.bottomCta}>
              <p className={styles.bottomCtaTitle}>공실 확인 후 바로 문의하세요</p>
              <p className={styles.bottomCtaSub}>전화 한 통으로 모든 조건을 바로 안내해 드립니다</p>
              <a href={`tel:${PHONE}`} className={styles.bottomPhoneBtn}>
                <PhoneIcon />
                {PHONE} 전화 문의
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
