import styles from './SectionCTA.module.scss'

export default function SectionCTA() {
  return (
    <div className={styles.wrap}>
      <a href="#contact" className={styles.btn}>
        공실 문의 바로가기
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
    </div>
  )
}
