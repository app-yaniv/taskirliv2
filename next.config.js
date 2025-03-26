/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as static site for GitHub Pages
  output: 'export',
  // Set the base path to match the GitHub repository name
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
  // Set asset prefix for GitHub Pages
  assetPrefix: '/taskirliv2',
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