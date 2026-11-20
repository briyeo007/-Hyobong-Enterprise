import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import sharp from 'sharp'
import { isAdmin, sameOrigin } from '@/lib/admin-guard'
import { storeImage, storeMode } from '@/lib/vacancy-store'
import { BUILDINGS } from '@/lib/vacancy-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 4 * 1024 * 1024 // Vercel 함수 요청 한도(4.5MB) 이하. 브라우저에서 미리 축소 후 전송합니다.
const ALLOWED_FORMATS = new Set(['jpeg', 'png', 'webp', 'heif', 'avif'])

const noStore = { 'Cache-Control': 'no-store' }
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status, headers: noStore })

export async function POST(req: Request) {
  if (!sameOrigin()) return fail('잘못된 요청입니다.', 403)
  if (!(await isAdmin())) return fail('로그인이 필요합니다.', 401)
  if (storeMode() === 'seed') return fail('저장소(Supabase)가 아직 연결되지 않았습니다.', 503)

  const len = Number(req.headers.get('content-length') ?? 0)
  if (len > MAX_BYTES + 64 * 1024) return fail('파일이 너무 큽니다 (최대 4MB).', 413)

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return fail('업로드 형식이 올바르지 않습니다.')
  }
  const file = form.get('file')
  const building = String(form.get('building') ?? '')
  if (!BUILDINGS.some((b) => b.id === building)) return fail('건물 값이 올바르지 않습니다.')
  if (!(file instanceof Blob) || file.size === 0) return fail('사진 파일을 선택해 주세요.')
  if (file.size > MAX_BYTES) return fail('파일이 너무 큽니다 (최대 4MB).', 413)

  // 파일 확장자·MIME은 신뢰하지 않고 실제 이미지 디코딩으로 검증한 뒤,
  // 회전 보정 + 크기 축소 + JPEG 재인코딩 (EXIF/GPS 등 메타데이터 제거)
  let out: Buffer
  try {
    const input = Buffer.from(await file.arrayBuffer())
    const img = sharp(input, { limitInputPixels: 60_000_000, failOn: 'error' })
    const meta = await img.metadata()
    if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) return fail('JPG, PNG, WEBP 사진만 업로드할 수 있습니다.')
    out = await img
      .rotate()
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toBuffer()
  } catch {
    return fail('사진 파일을 읽을 수 없습니다. 다른 사진으로 시도해 주세요.')
  }

  const month = new Date().toISOString().slice(0, 7)
  const objectPath = `${building}/${month}/${randomUUID()}.jpg`
  try {
    const url = await storeImage(objectPath, out)
    return NextResponse.json({ url }, { headers: noStore })
  } catch (e) {
    console.error('[admin] upload failed', e)
    return fail('사진 저장 중 오류가 발생했습니다.', 500)
  }
}
