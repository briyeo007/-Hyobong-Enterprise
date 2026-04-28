'use client'
import { useEffect, useState } from 'react'

function formatKoreanDate() {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}. ${m}. ${d}. 기준`
}

export default function TodayDate({ className }: { className?: string }) {
  const [date, setDate] = useState('')

  useEffect(() => {
    setDate(formatKoreanDate())
  }, [])

  if (!date) return null
  return <span className={className}>{date}</span>
}
