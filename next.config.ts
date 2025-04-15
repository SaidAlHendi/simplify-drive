/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'flippant-caribou-110.convex.cloud',
      },
    ],
  },
}

export default nextConfig
