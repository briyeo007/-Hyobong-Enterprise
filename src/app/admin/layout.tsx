import type { Metadata, Viewport } from 'next'
import styles from './admin.module.scss'

export const metadata: Metadata = {
  title: '효봉기업 관리자',
  robots: { index: false, follow: false, nocache: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>{children}</div>
}
