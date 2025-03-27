/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  distDir: 'docs',
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
    serverActions: {
      allowedOrigins: ["localhost:3000", "app-yaniv.github.io"]
    }
  },
}

module.exports = nextConfig 