import { sendGAEvent } from '@next/third-parties/google'

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// 페이지 경로 → 건물명. 건물 페이지 추가 시 여기에도 추가하세요.
const BUILDING_BY_PATH: Record<string, string> = {
  '/hyobong8': '효봉8빌딩',
  '/bisan': '비산효봉',
  '/hyobong-enterprise': '효봉기업',
}

export function getBuildingName(pathname: string): string | undefined {
  return BUILDING_BY_PATH[pathname.replace(/\/$/, '')]
}

type PhoneClickParams = {
  pagePath: string
  clickLocation: string
  buildingName?: string
  unitName?: string
}

// 페이지뷰는 GA4 자동 측정(초기 로드 + 브라우저 히스토리 변경)이 처리하므로 여기서는 보내지 않습니다.
export function trackPhoneClick({ pagePath, clickLocation, buildingName, unitName }: PhoneClickParams) {
  if (!GA_MEASUREMENT_ID) return
  sendGAEvent('event', 'phone_click', {
    page_path: pagePath,
    click_location: clickLocation,
    ...(buildingName && { building_name: buildingName }),
    ...(unitName && { unit_name: unitName }),
  })
}
