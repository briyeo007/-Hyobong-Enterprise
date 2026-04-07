import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.scss'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
})

const BASE_URL = 'https://www.hyobongkiup.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: '효봉8빌딩 임대 안내 | 서초구 역세권 사무실',
  description: '서울 서초구 남부터미널역 도보 5분. 효봉8빌딩 공실 임대 안내 — 역세권, 넓은 주차, 관리 상태 우수. 문의: 02-3473-6651',
  keywords: ['효봉8빌딩', '임대', '공실', '사무실 임대', '상가 임대', '서초구 임대', '남부터미널 사무실', '역세권 사무실'],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: '효봉8빌딩 임대 안내',
    title: '효봉8빌딩 임대 안내 | 서초구 역세권 사무실',
    description: '서울 서초구 남부터미널역 도보 5분. 역세권·넓은 주차·우수한 관리 상태. 지금 바로 문의하세요. 02-3473-6651',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: '효봉8빌딩 임대 안내 | 서초구 역세권 사무실',
    description: '서울 서초구 남부터미널역 도보 5분. 역세권·넓은 주차·우수한 관리 상태. 문의: 02-3473-6651',
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
      </head>
      <body className={notoSansKR.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
