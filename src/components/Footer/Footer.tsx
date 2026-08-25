import Image from 'next/image'
import PhoneLink from '@/components/PhoneLink/PhoneLink'
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
            <PhoneLink className={styles.phone} location="footer">02-3473-6651</PhoneLink>
            <span className={styles.sep} />
            <span className={styles.address}>서울 서초구 서운로 20 (서초2동 1364-1번지)</span>
          </div>
        </div>

        <p className={styles.copyright}>© {year} 효봉기업. All rights reserved.</p>
      </div>
    </footer>
  )
}
