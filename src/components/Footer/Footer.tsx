import styles from './Footer.module.scss'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>H</div>
          <div>
            <p className={styles.logoText}>효봉8빌딩</p>
            <p className={styles.logoSub}>임대 안내</p>
          </div>
        </div>

        <div className={styles.info}>
          <p>
            <span className={styles.infoLabel}>전화</span>
            <a href="tel:02-3473-6651" className={styles.infoPhone}>02-3473-6651</a>
          </p>
          <p>
            <span className={styles.infoLabel}>주소</span>
            <span>서울 서초구 남부순환로333길 13 효봉빌딩</span>
          </p>
        </div>

        <p className={styles.copyright}>
          © {year} 효봉8빌딩. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
