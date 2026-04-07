import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.scss'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: '효봉8빌딩 임대 안내',
  description: '효봉8빌딩 공실 임대 안내 — 역세권, 넓은 주차, 관리 상태 우수. 문의: 02-3473-6651',
  keywords: ['효봉8빌딩', '임대', '공실', '사무실 임대', '상가 임대'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
