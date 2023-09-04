/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
  // async redirects() {
  //   return [
  //     {
  //       source: '/vocabulary',
  //       destination: '/vocabulary/all',
  //       permanent: true
  //     }
  //   ]
  // }
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/search/:path*',
  //       destination: 'https://jisho.org/api/v1/search/:path*'
  //     }
  //   ]
  // }
}

module.exports = nextConfig
