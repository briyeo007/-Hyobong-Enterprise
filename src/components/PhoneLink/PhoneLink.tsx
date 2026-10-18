'use client'

import { track } from '@vercel/analytics'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { getBuildingName, trackPhoneClick } from '@/lib/analytics'

interface PhoneLinkProps {
  className?: string
  location: string
  phone?: string
  building?: string
  unit?: string
  children: ReactNode
}

export default function PhoneLink({ className, location, phone = '02-3473-6651', building, unit, children }: PhoneLinkProps) {
  const pathname = usePathname()

  const handleClick = () => {
    track('전화 연결 클릭', { 위치: location })
    trackPhoneClick({
      pagePath: pathname,
      clickLocation: location,
      buildingName: building ?? getBuildingName(pathname),
      unitName: unit,
    })
  }

  return (
    <a href={`tel:${phone}`} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
