import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  devIndicators: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'tr'],
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

export default nextConfig
