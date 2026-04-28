'use client'

function formatKoreanDate() {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}. ${m}. ${d}. 기준`
}

export default function TodayDate({ className }: { className?: string }) {
  return (
    <span className={className} suppressHydrationWarning>
      {formatKoreanDate()}
    </span>
  )
}
