'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './PropertyImageCarousel.module.scss'

interface Props {
  images: string[]
  alt: string
}

export default function PropertyImageCarousel({ images, alt }: Props) {
  const [current, setCurrent] = useState(0)

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

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length)
  const next = () => setCurrent((c) => (c + 1) % images.length)

  return (
    <div className={styles.carousel}>
      <div className={styles.imageWrap}>
        <Image
          src={images[current]}
          alt={`${alt} ${current + 1}`}
          fill
          quality={90}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="이전 사진">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="다음 사진">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <div className={styles.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`${i + 1}번 사진`}
              />
            ))}
          </div>
          <span className={styles.counter}>{current + 1} / {images.length}</span>
        </>
      )}
    </div>
  )
}
