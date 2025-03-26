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
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  },
  // Handle trailing slashes
  trailingSlash: true,
  // Disable image optimization for static export
  assetPrefix: '/taskirliv2',
}

module.exports = nextConfig 