/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/taskirliv2',
  assetPrefix: '/taskirliv2/',
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 