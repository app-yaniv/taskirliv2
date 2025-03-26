/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Configure base path only if not in production
  basePath: process.env.NODE_ENV === 'production' ? '' : '/taskirliv2',
  
  images: {
    // Enable image optimization for server deployment
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Handle trailing slashes - removing this to fix tab navigation issues
  // trailingSlash: true,
  
  // Set asset prefix only for GitHub Pages if needed
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '/taskirliv2/',
  
  // Temporarily disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig 