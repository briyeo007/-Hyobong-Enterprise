'use client'

import { useInView } from '@/hooks/useInView'

interface Props {
  children: React.ReactNode
  className?: string
  activeClassName: string
  threshold?: number
  style?: React.CSSProperties
}

export default function AnimateIn({ children, className = '', activeClassName, threshold, style }: Props) {
  const { ref, inView } = useInView(threshold)
  return (
    <div ref={ref} className={`${className}${inView ? ` ${activeClassName}` : ''}`} style={style}>
      {children}
    </div>
  )
}
