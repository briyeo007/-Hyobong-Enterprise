'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './AutoSlide.module.scss'

interface Props {
  images: string[]
  alt: string
  interval?: number
}

export default function AutoSlide({ images, alt, interval = 3000 }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length)
    }, interval)
    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className={styles.wrap}>
      {images.map((src, i) => (
        <div
          key={src}
          className={`${styles.slide} ${i === current ? styles.active : ''}`}
        >
          <Image
            src={src}
            alt={`${alt} ${i + 1}`}
            fill
            quality={85}
            priority={i === 0}
            className={styles.img}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
      <div className={styles.overlay} />
      <div className={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
