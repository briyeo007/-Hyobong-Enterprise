'use client'

import { track } from '@vercel/analytics'
import type { ReactNode } from 'react'

interface PhoneLinkProps {
  className?: string
  location: string
  phone?: string
  children: ReactNode
}

export default function PhoneLink({ className, location, phone = '02-3473-6651', children }: PhoneLinkProps) {
  return (
    <a
      href={`tel:${phone}`}
      className={className}
      onClick={() => track('전화 연결 클릭', { 위치: location })}
    >
      {children}
    </a>
  )
}
