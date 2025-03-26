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
}

module.exports = nextConfig 