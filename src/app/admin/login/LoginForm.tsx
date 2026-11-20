'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { loginAction } from '../actions'
import styles from '../admin.module.scss'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={styles.btnPrimary} disabled={pending}>
      {pending ? '확인 중…' : '로그인'}
    </button>
  )
}

export default function LoginForm() {
  const [state, action] = useFormState(loginAction, undefined)
  return (
    <form action={action} className={styles.loginForm}>
      <label className={styles.field}>
        <span>비밀번호</span>
        <input type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      {state?.error && <p className={styles.errorBox}>{state.error}</p>}
      <Submit />
    </form>
  )
}
