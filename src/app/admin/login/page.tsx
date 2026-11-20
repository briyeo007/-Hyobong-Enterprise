import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin-guard'
import { authConfigured } from '@/lib/admin-auth'
import LoginForm from './LoginForm'
import styles from '../admin.module.scss'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect('/admin')
  return (
    <main className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>효봉기업 관리자</h1>
        <p className={styles.muted}>공실 정보·사진 관리</p>
        {authConfigured() ? (
          <LoginForm />
        ) : (
          <p className={styles.errorBox}>
            관리자 비밀번호가 설정되지 않았습니다. Vercel 환경변수 ADMIN_PASSWORD(8자 이상)와
            ADMIN_SESSION_SECRET(32자 이상)을 설정해 주세요.
          </p>
        )}
      </div>
    </main>
  )
}
