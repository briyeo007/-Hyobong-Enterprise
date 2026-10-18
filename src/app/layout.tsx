import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.scss'

const BASE_URL = 'https://www.hyobongkiup.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: '효봉기업 | 남부터미널역·서초동 사무실 임대 공실 즉시 확인',
  description: '남부터미널역 사무실 임대(효봉8빌딩), 서초동 양재역 사무실 임대(효봉기업), 안양 비산효봉. 사무실·상가 공실 즉시 확인. 문의: 02-3473-6651',
  keywords: ['남부터미널역 사무실 임대', '서초동 사무실 임대', '서초구 사무실 임대', '효봉기업','효봉기업 임대', '효봉기업 사무실', '효봉기업 상가', '사무실 임대', '상가 임대', '효봉8빌딩', '비산효봉', '남부터미널 사무실', '안양 사무실 임대'],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: '효봉기업',
    title: '효봉기업 | 남부터미널역·서초동 사무실 임대',
    description: '남부터미널역·서초동 사무실 임대, 안양 비산효봉. 공실 즉시 안내. 문의: 02-3473-6651',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: '효봉기업 | 남부터미널역·서초동 사무실 임대',
    description: '남부터미널역·서초동 사무실 임대, 안양 비산효봉. 공실 즉시 안내. 문의: 02-3473-6651',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="2bd22d4d4301aa66ef7b753371cd34a9cef9e3e4" />
        <meta name="google-site-verification" content="k2vUG4wByx1PSBDuv18F3WGc6AjxQsmpeFThcC15wCw" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
