/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_GH_PAGES === 'true'

const nextConfig = isGhPages
  ? {
      output: 'export',
      basePath: '/-Hyobong-Enterprise',
      images: { unoptimized: true },
    }
  : {}

export default nextConfig
