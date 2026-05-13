'use client'

import { useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import styles from './PropertyImageCarousel.module.scss'

interface Props {
  images: string[]
  alt: string
}

export default function PropertyImageCarousel({ images, alt }: Props) {
  const currentRef = useRef(0)
  const wrapsRef = useRef<(HTMLDivElement | null)[]>([])
  const dotsRef = useRef<(HTMLButtonElement | null)[]>([])
  const counterRef = useRef<HTMLSpanElement | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // 마운트 후 모든 이미지를 강제 디코딩 — 클릭 시점에 디코딩 지연 제거
  useEffect(() => {
    const imgs = carouselRef.current?.querySelectorAll<HTMLImageElement>('img')
    imgs?.forEach((img) => img.decode().catch(() => {}))
  }, [])

  const goTo = useCallback((next: number) => {
    const n = ((next % images.length) + images.length) % images.length
    const prev = currentRef.current
    if (prev === n) return

    wrapsRef.current[prev]?.classList.remove(styles.imageActive)
    wrapsRef.current[n]?.classList.add(styles.imageActive)
    dotsRef.current[prev]?.classList.remove(styles.dotActive)
    dotsRef.current[n]?.classList.add(styles.dotActive)
    if (counterRef.current) counterRef.current.textContent = `${n + 1} / ${images.length}`

    currentRef.current = n
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className={styles.placeholder}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <circle cx="12" cy="12" r="3.5"/>
          <path d="M8.5 5l1.5-2h4l1.5 2"/>
        </svg>
        <span>사진 준비중</span>
      </div>
    )
  }

  return (
    <div ref={carouselRef} className={styles.carousel}>
      {images.map((src, i) => (
        <div
          key={src}
          ref={(el) => { wrapsRef.current[i] = el }}
          className={`${styles.imageWrap}${i === 0 ? ` ${styles.imageActive}` : ''}`}
        >
          <Image
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            quality={90}
            loading="eager"
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}

      {images.length > 1 && (
        <>
          <button
            className={`${styles.arrow} ${styles.arrowLeft}`}
            onClick={() => goTo(currentRef.current - 1)}
            aria-label="이전 사진"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            className={`${styles.arrow} ${styles.arrowRight}`}
            onClick={() => goTo(currentRef.current + 1)}
            aria-label="다음 사진"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                ref={(el) => { dotsRef.current[i] = el }}
                className={`${styles.dot}${i === 0 ? ` ${styles.dotActive}` : ''}`}
                onClick={() => goTo(i)}
                aria-label={`${i + 1}번 사진`}
              />
            ))}
          </div>
          <span ref={counterRef} className={styles.counter}>1 / {images.length}</span>
        </>
      )}
    </div>
  )
}
