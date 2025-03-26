/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/taskirliv2',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Handle trailing slashes
  trailingSlash: true,
  // Disable image optimization for static export
  assetPrefix: '/taskirliv2',
  // Temporarily disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig 