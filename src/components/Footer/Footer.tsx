import Image from 'next/image'
import styles from './Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Image src="/logo.png" alt="효봉8빌딩 로고" width={997} height={252} className={styles.logoImg} />
          </div>

          <div className={styles.contacts}>
            <a href="tel:02-3473-6651" className={styles.phone}>02-3473-6651</a>
            <span className={styles.sep} />
            <span className={styles.address}>서울 서초구 서운로 20 (서초2동 1364-1번지)</span>
          </div>
        </div>

        <div className={styles.bizInfo}>
          <span>대표자명: 여효창</span>
          <span className={styles.bizSep} />
          <span>사업자등록번호: 214-07-63073</span>
        </div>

        <p className={styles.copyright}>© {year} 효봉기업. All rights reserved.</p>
      </div>
    </footer>
  )
}
