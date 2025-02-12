/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    domains: [], // Add any external image domains you'll use
    unoptimized: false,
  },
  // Recommended for production
  poweredByHeader: false,
  // Enable React strict mode for better development
  reactStrictMode: true,
}

module.exports = nextConfig 