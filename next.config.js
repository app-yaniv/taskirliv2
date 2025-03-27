/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/taskirliv2',
  assetPrefix: '/taskirliv2/',
  distDir: 'out',
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
    serverActions: {
      allowedOrigins: ["localhost:3000", "app-yaniv.github.io"]
    }
  },
}

// This is important for GitHub Pages
if (process.env.NODE_ENV === 'production') {
  console.log('Building for production with basePath: /taskirliv2')
}

module.exports = nextConfig 