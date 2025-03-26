/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export configuration
  // output: 'export',
  
  // Configure base path only if not in production
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  
  images: {
    // Enable image optimization for server deployment
    unoptimized: false,
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
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
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