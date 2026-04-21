import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'

const TARGET_DIR = process.argv[2]

if (!TARGET_DIR) {
  console.error('사용법: node scripts/optimize-images.mjs public/images/폴더명')
  process.exit(1)
}

const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const files = readdirSync(TARGET_DIR).filter(f => EXTS.has(extname(f).toLowerCase()))

console.log(`📁 ${TARGET_DIR} — ${files.length}개 이미지 처리 중...`)

for (const file of files) {
  const filePath = join(TARGET_DIR, file)
  const tmp = filePath + '.tmp'

  await sharp(filePath)
    .rotate()              // EXIF 방향 자동 보정
    .resize(1600, 1200, {  // 최대 크기 제한 (가로세로 비율 유지)
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(tmp)

  const before = statSync(filePath).size
  const after = statSync(tmp).size

  // 원본 덮어쓰기
  const { renameSync } = await import('fs')
  renameSync(tmp, filePath)

  console.log(`  ✅ ${file}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB`)
}

console.log('완료!')
