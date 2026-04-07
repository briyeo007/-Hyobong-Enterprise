import styles from './Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logoIcon}>H</div>
            <div>
              <p className={styles.logoText}>효봉8빌딩</p>
              <p className={styles.logoSub}>임대 안내</p>
            </div>
          </div>

          <div className={styles.contacts}>
            <a href="tel:02-3473-6651" className={styles.phone}>02-3473-6651</a>
            <span className={styles.sep} />
            <span className={styles.address}>서울 서초구 남부순환로333길 13 효봉빌딩</span>
          </div>
        </div>

        <p className={styles.copyright}>© {year} 효봉8빌딩. All rights reserved.</p>
      </div>
    </footer>
  )
}
