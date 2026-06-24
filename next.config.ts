import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
let mediaHostname: string | null = null

if (mediaBaseUrl) {
  try {
    mediaHostname = new URL(mediaBaseUrl).hostname
  } catch {
    mediaHostname = null
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-4724642652e24a15ae8859ce2d274595.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      ...(mediaHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: mediaHostname,
              port: '',
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
}

export default withPayload(nextConfig, {
  // Bundles db adapters in dev so Turbopack can load @payloadcms/db-postgres
  devBundleServerPackages: true,
})
