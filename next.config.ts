// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Disable TypeScript checks during development and build
  typescript: {
    // Skip TypeScript checks during development and build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint checks during development and build
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
}

export default nextConfig
