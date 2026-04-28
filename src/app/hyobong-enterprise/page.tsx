import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'
import PropertyImageCarousel from '@/components/sections/PropertySection/PropertyImageCarousel'
import LocationSection from '@/components/sections/LocationSection/LocationSection'
import AnimateIn from '@/components/AnimateIn'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: '효봉기업 공실 안내 | 서초구 사무실 임대',
  description: '서울 서초구 서운로 20 효봉기업. 8층 사무실 공실 1개 즉시 입주 가능. 무료주차 1대 제공. 임대 문의: 02-3473-6651',
}

const PHONE = '02-3473-6651'

const VACANCY = {
  floor: '8층',
  summary: '사무실 임대 · 즉시 입주 가능',
  area: { contract: 66, actual: 33 },
  deposit: '5,000만원',
  rent: '350만원',
  maintenance: '150만원',
  tags: ['즉시 입주 가능', '조건 협의 가능', '무료주차 1대'],
  detailSpecs: [
    { label: '용도', value: '사무실' },
    { label: '주차', value: '무료 1대 제공' },
    { label: '엘리베이터', value: '있음' },
    { label: '관리비 포함', value: '전기·수도·청소' },
    { label: '입주 가능', value: '즉시' },
  ],
  images: [
    '/images/hyobong-enterprise/KakaoTalk_20260421_144826946.jpg',
    '/images/hyobong-enterprise/KakaoTalk_20260421_144826946_01.jpg',
  ],
}

const PhoneIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
)

export default function HyobongEnterprisePage() {
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <Link href="/" className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              건물 선택으로 돌아가기
            </Link>

            <div className={styles.urgencyBanner}>
              <span className={styles.urgencyDot} />
              현재 공실 1개 · 빠른 계약 가능
            </div>

            <h1 className={styles.heroTitle}>효봉기업</h1>
            <p className={styles.heroLocation}>서울 서초구 서운로 20 (서초2동 1364-1번지)</p>

            <div className={styles.heroPhoneRow}>
              <a href={`tel:${PHONE}`} className={styles.heroPhoneBtn}>
                <PhoneIcon size={22} />
                {PHONE} 바로 전화
              </a>
              <span className={styles.heroPhoneNote}>지금 바로 안내 가능합니다</span>
            </div>
          </div>
        </section>

        {/* ── Vacancy ── */}
        <section className={styles.vacancySection}>
          <div className={styles.vacancyContainer}>
            <AnimateIn className="reveal" activeClassName="inView">
              <div className={styles.sectionHead}>
                <span className={styles.sectionLabel}>공실 정보</span>
                <h2 className={styles.sectionTitle}>현재 공실 1개</h2>
                <p className={styles.sectionDesc}>지금 바로 입주 가능 · 조건 협의 환영</p>
              </div>
            </AnimateIn>

            <AnimateIn className="revealScale" activeClassName="inView" threshold={0.05}>
            <div className={styles.vacancyCard}>
              {VACANCY.images.length > 0 && (
                <PropertyImageCarousel images={VACANCY.images} alt={VACANCY.floor} />
              )}

              <div className={styles.cardHeader}>
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot} />
                  즉시 입주 가능
                </div>
                <span className={styles.cardFloor}>{VACANCY.floor}</span>
              </div>

              <p className={styles.cardSummary}>{VACANCY.summary}</p>

              <div className={styles.areaRow}>
                <div className={styles.areaItem}>
                  <span className={styles.areaLabel}>임대 평수</span>
                  <span className={styles.areaValue}>{VACANCY.area.contract}평</span>
                </div>
                <div className={styles.areaDivider} />
                <div className={styles.areaItem}>
                  <span className={styles.areaLabel}>실 평수</span>
                  <span className={styles.areaValue}>{VACANCY.area.actual}평</span>
                </div>
              </div>

              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>보증금</span>
                  <span className={styles.specValue}>{VACANCY.deposit}</span>
                </div>
                <div className={styles.specDivider} />
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>월 임대료</span>
                  <span className={styles.specValue}>{VACANCY.rent}</span>
                </div>
                <div className={styles.specDivider} />
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>관리비</span>
                  <span className={styles.specValue}>{VACANCY.maintenance}</span>
                </div>
              </div>

              <div className={styles.detailTable}>
                <p className={styles.detailTableTitle}>상세 정보</p>
                <table className={styles.table}>
                  <tbody>
                    {VACANCY.detailSpecs.map((row) => (
                      <tr key={row.label} className={styles.tableRow}>
                        <th className={styles.tableTh}>{row.label}</th>
                        <td className={styles.tableTd}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.tags}>
                {VACANCY.tags.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>

              <a href={`tel:${PHONE}`} className={styles.cardCta}>
                <PhoneIcon size={20} />
                문의하기 · {PHONE}
              </a>
            </div>
            </AnimateIn>

          </div>
        </section>

        {/* ── Location ── */}
        <LocationSection
          naverMapUrl="https://naver.me/G58NvSJ2"
          googleMapsQuery="서울+서초구+서운로+20"
          address={'서울 서초구 서운로 20\n(서초2동 1364-1번지)'}
          accessPoints={[]}
          showCta={false}
        />

        {/* ── Bottom CTA ── */}
        <section className={styles.bottomCtaSection}>
          <div className={styles.vacancyContainer}>
            <AnimateIn className="revealScale" activeClassName="inView">
              <div className={styles.bottomCta}>
                <p className={styles.bottomCtaTitle}>고민하지 말고 지금 바로 전화하세요</p>
                <p className={styles.bottomCtaSub}>먼저 연락하시는 분께 우선 안내해 드립니다</p>
                <a href={`tel:${PHONE}`} className={styles.bottomPhoneBtn}>
                  <PhoneIcon size={26} />
                  {PHONE}
                </a>
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
