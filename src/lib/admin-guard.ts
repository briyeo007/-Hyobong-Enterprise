// 서버 액션·API에서 매 요청마다 다시 확인하는 관리자 권한 검증 (middleware와 이중 확인)
import { cookies, headers } from 'next/headers'
import { SESSION_COOKIE, verifySessionToken } from './admin-auth'

export async function isAdmin(): Promise<boolean> {
  return verifySessionToken(cookies().get(SESSION_COOKIE)?.value)
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error('UNAUTHORIZED')
}

/** 같은 사이트에서 보낸 요청인지 확인 (CSRF 방지) */
export function sameOrigin(): boolean {
  const h = headers()
  const origin = h.get('origin')
  const host = h.get('x-forwarded-host') ?? h.get('host')
  if (!origin || !host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
