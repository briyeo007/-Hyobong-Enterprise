'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.scss'

const PHONE = '02-3473-6651'

const NAV_ITEMS = [
  { label: '효봉8빌딩', href: '/hyobong8' },
  { label: '비산효봉', href: '/bisan' },
  { label: '효봉기업', href: '/hyobong-enterprise' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link className={styles.logo} href="/">
            <Image src="/logo.png" alt="효봉기업 로고" width={997} height={252} className={styles.logoImg} />
          </Link>

          {/* 데스크탑 nav */}
          <nav className={styles.desktopNav}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <a href={`tel:${PHONE}`} className={styles.navCta}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
              전화 문의
            </a>
          </nav>

          {/* 햄버거 */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* 모바일 메뉴 드로어 */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}
      <div className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>효봉기업 임대</span>
          <button className={styles.closeBtn} onClick={() => setMobileOpen(false)} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <nav className={styles.drawerNav}>
          <Link
            href="/"
            className={`${styles.drawerLink} ${pathname === '/' ? styles.drawerLinkActive : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            건물 선택 (홈)
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.drawerLink} ${pathname === item.href ? styles.drawerLinkActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ))}
        </nav>

        <a href={`tel:${PHONE}`} className={styles.drawerCta}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
          {PHONE} 전화 문의
        </a>
      </div>
    </>
  )
}
