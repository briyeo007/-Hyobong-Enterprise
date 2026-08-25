import PhoneLink from '@/components/PhoneLink/PhoneLink'
import styles from './CallCTASection.module.scss'

export default function CallCTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>📞 공실 문의 안내</p>
        <h2 className={styles.title}>
          지금 전화하면 바로<br />공실 안내드립니다
        </h2>
        <p className={styles.sub}>대기 없이 담당자가 직접 연결됩니다</p>
        <PhoneLink className={styles.btn} location="call_cta_section">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
          02-3473-6651
        </PhoneLink>
      </div>
    </section>
  )
}
