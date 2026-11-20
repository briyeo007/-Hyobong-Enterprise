import { withBotId } from 'botid/next/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 관리자 페이지에서 업로드한 공실 사진(Supabase Storage 공개 버킷)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/vacancy-images/**',
      },
    ],
  },
};

export default withBotId(nextConfig);
