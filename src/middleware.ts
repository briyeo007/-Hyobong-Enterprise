import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth'

// /admin, /api/admin 접근 시 세션 확인 (각 서버 액션·API에서도 다시 검증함)
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isLogin = pathname === '/admin/login'
  const ok = isLogin || (await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))

  let res: NextResponse
  if (ok) {
    res = NextResponse.next()
  } else if (pathname.startsWith('/api/')) {
    res = NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  } else {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    res = NextResponse.redirect(url)
  }
  res.headers.set('Cache-Control', 'private, no-store, max-age=0')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Referrer-Policy', 'same-origin')
  return res
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
}
