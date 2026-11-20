import { cache } from 'react'
import { listForSite } from './vacancy-store'
import { groupForSite } from './vacancy-types'

/** 홈페이지 전체에서 쓰는 건물별 공실 데이터 (한 요청 안에서는 1회만 조회) */
export const getSiteVacancies = cache(async () => groupForSite(await listForSite()))
