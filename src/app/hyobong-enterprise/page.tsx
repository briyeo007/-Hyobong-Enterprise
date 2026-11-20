import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import FloatingButtons from '@/components/FloatingButtons/FloatingButtons'
import PropertyImageCarousel from '@/components/sections/PropertySection/PropertyImageCarousel'
import LocationSection from '@/components/sections/LocationSection/LocationSection'
import AnimateIn from '@/components/AnimateIn'
import TodayDate from '@/components/TodayDate'
import PhoneLink from '@/components/PhoneLink/PhoneLink'
import { getSiteVacancies } from '@/lib/vacancies'
import styles from './page.module.scss'

const PHONE = '02-3473-6651'


// 관리자 페이지에서 저장하면 즉시 갱신되고, 그 외에는 1시간마다 다시 확인합니다.
export const revalidate = 3600

const FALLBACK_IMAGE = '/images/hyobong-enterprise/KakaoTalk_20260421_144826946.jpg'
const BASE_URL = 'https://www.hyobongkiup.com'

// 첫 번째 공실 값이 description·구조화 데이터에 자동 반영됩니다.
async function getSummary() {
  const { all } = (await getSiteVacancies())['hyobong-enterprise']
  const v = all[0]
  const summary = v
    ? `${v.floor} 사무실 임대 ${v.area.contract}평(실 ${v.area.actual}평), ${v.availability === 'now' ? '즉시 입주' : v.urgency.replace('✔ ', '')}, 무료주차 1대`
    : '사무실 임대 문의, 무료주차 1대'
  const image = v?.images[0] ?? FALLBACK_IMAGE
  return { VACANCY_SUMMARY: summary, image }
}

export async function generateMetadata(): Promise<Metadata> {
  const { VACANCY_SUMMARY, image } = await getSummary()
  return {
    title: '양재역 사무실 임대 | 서초동 효봉기업 빌딩 공실 안내',
    description: `서울 서초구 서초동 서운로 20 효봉기업 빌딩. 3호선·신분당선 양재역 도보 약 5분. ${VACANCY_SUMMARY}. 문의: 02-3473-6651`,
    keywords: ['양재역 사무실 임대', '양재역 사무실', '서운로 사무실 임대', '효봉기업 빌딩', '효봉기업'],
    alternates: { canonical: '/hyobong-enterprise' },
    openGraph: {
      type: 'website',
      url: '/hyobong-enterprise',
      siteName: '효봉기업',
      locale: 'ko_KR',
      title: '양재역 사무실 임대 | 서초동 효봉기업 빌딩',
      description: `서초동 양재역 도보 5분. ${VACANCY_SUMMARY}. 문의: 02-3473-6651`,
      images: [image],
    },
    twitter: {
      card: 'summary',
      title: '양재역 사무실 임대 | 서초동 효봉기업 빌딩',
      description: `서초동 양재역 도보 5분. ${VACANCY_SUMMARY}. 문의: 02-3473-6651`,
    },
  }
}

function jsonLd(VACANCY_SUMMARY: string, image: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: '효봉기업 빌딩',
    description: `서울 서초구 서초동, 3호선·신분당선 양재역 도보 약 5분. ${VACANCY_SUMMARY}`,
    url: 'https://www.hyobongkiup.com/hyobong-enterprise',
    image: image.startsWith('http') ? image : `${BASE_URL}${image}`,
    telephone: '+82-2-3473-6651',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '서운로 20',
      addressLocality: '서초구',
      addressRegion: '서울특별시',
      addressCountry: 'KR',
    },
  }
}

const PhoneIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
  </svg>
)

export default async function HyobongEnterprisePage() {
  const { all: vacancies, current, upcoming } = (await getSiteVacancies())['hyobong-enterprise']
  const vacancyText = `현재 공실 ${current.length}개${upcoming.length > 0 ? ` · 공실 예정 ${upcoming.length}개` : ''}`
  const { VACANCY_SUMMARY, image } = await getSummary()
  const JSON_LD = jsonLd(VACANCY_SUMMARY, image)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
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
              {/* 공실 수는 관리자 페이지(/admin)의 공실 데이터로 자동 반영됩니다 */}
              {vacancyText} · 빠른 계약 가능
            </div>

            <h1 className={styles.heroTitle}>효봉기업</h1>
            <p className={styles.heroLocation}>서울 서초구 서운로 20 (서초2동 1364-1번지) · 양재역 도보 5분</p>

            <div className={styles.heroPhoneRow}>
              <PhoneLink className={styles.heroPhoneBtn} location="hyobong_enterprise_hero" phone={PHONE}>
                <PhoneIcon size={22} />
                {PHONE} 바로 전화
              </PhoneLink>
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
                <h2 className={styles.sectionTitle}>{vacancyText}</h2>
                <p className={styles.sectionDesc}>지금 바로 입주 가능 · 조건 협의 환영</p>
                <p className={styles.updateDate}><TodayDate /></p>
              </div>
            </AnimateIn>

            {vacancies.map((VACANCY) => (
            <AnimateIn key={VACANCY.id} className="revealScale" activeClassName="inView" threshold={0.05}>
            <div className={styles.vacancyCard}>
              {VACANCY.images.length > 0 && (
                <PropertyImageCarousel images={VACANCY.images} alt={`효봉기업 빌딩 ${VACANCY.floor} 사무실`} />
              )}

              <div className={styles.cardHeader}>
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot} />
                  {VACANCY.urgency.replace('✔ ', '')}
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

              <PhoneLink className={styles.cardCta} location="hyobong_enterprise_card" phone={PHONE} unit={VACANCY.floor}>
                <PhoneIcon size={20} />
                문의하기 · {PHONE}
              </PhoneLink>
            </div>
            </AnimateIn>
            ))}

          </div>
        </section>

        {/* ── Location ── */}
        <LocationSection
          naverMapUrl="https://naver.me/G58NvSJ2"
          googleMapsQuery="서울+서초구+서운로+20"
          address={'서울 서초구 서운로 20\n(서초2동 1364-1번지)'}
          description="3호선·신분당선 양재역 도보 5분, 서울 서초구 서초동에 위치합니다."
          accessPoints={[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                </svg>
              ),
              category: '지하철',
              items: ['3호선 · 신분당선 양재역 도보 약 5분'],
            },
          ]}
          showCta={false}
        />

        {/* ── Bottom CTA ── */}
        <section className={styles.bottomCtaSection}>
          <div className={styles.vacancyContainer}>
            <AnimateIn className="revealScale" activeClassName="inView">
              <div className={styles.bottomCta}>
                <p className={styles.bottomCtaTitle}>고민하지 말고 지금 바로 전화하세요</p>
                <p className={styles.bottomCtaSub}>먼저 연락하시는 분께 우선 안내해 드립니다</p>
                <PhoneLink className={styles.bottomPhoneBtn} location="hyobong_enterprise_bottom_cta" phone={PHONE}>
                  <PhoneIcon size={26} />
                  {PHONE}
                </PhoneLink>
              </div>
            </AnimateIn>
            <p className={styles.relatedLink}>
              같은 서초동의 <Link href="/hyobong8">남부터미널역 효봉8빌딩 사무실 공실</Link>도 확인해 보세요.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </>
  )
}
