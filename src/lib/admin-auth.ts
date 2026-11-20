// 관리자 1인 인증: 서명된 세션 쿠키 (Web Crypto 사용 → middleware(Edge)·서버(Node) 공용)
// 서명 키 = ADMIN_SESSION_SECRET + ADMIN_PASSWORD → 비밀번호를 바꾸면 기존 세션이 모두 무효화됩니다.

export const SESSION_COOKIE = 'hb_admin'
export const SESSION_TTL_SEC = 60 * 60 * 12 // 12시간

const enc = new TextEncoder()

function b64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function authConfigured(): boolean {
  const pw = process.env.ADMIN_PASSWORD ?? ''
  const secret = process.env.ADMIN_SESSION_SECRET ?? ''
  return pw.length >= 10 && secret.length >= 32
}

async function hmacKey(): Promise<CryptoKey> {
  const material = `${process.env.ADMIN_SESSION_SECRET}::${process.env.ADMIN_PASSWORD}`
  return crypto.subtle.importKey('raw', enc.encode(material), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

async function sign(payload: string): Promise<string> {
  return b64url(await crypto.subtle.sign('HMAC', await hmacKey(), enc.encode(payload)))
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC
  const nonce = b64url(crypto.getRandomValues(new Uint8Array(12)))
  const payload = `${exp}.${nonce}`
  return `${payload}.${await sign(payload)}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !authConfigured()) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [exp, nonce, sig] = parts
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false
  const expected = await sign(`${exp}.${nonce}`)
  return timingSafeEqualStr(sig, expected)
}

/** 비밀번호 비교: 양쪽을 해시해 길이를 맞춘 뒤 상수 시간 비교 */
export async function checkPassword(input: string): Promise<boolean> {
  if (!authConfigured()) return false
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(input)),
    crypto.subtle.digest('SHA-256', enc.encode(process.env.ADMIN_PASSWORD!)),
  ])
  return timingSafeEqualStr(b64url(a), b64url(b))
}
