/** @type {import('next').NextConfig} */
import dotenv from 'dotenv'
dotenv.config()

import withBundleAnalyzer from '@next/bundle-analyzer'

const bundleAnalyzer = withBundleAnalyzer({
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '800mb',
    },
  },
}

export default bundleAnalyzer(nextConfig)
