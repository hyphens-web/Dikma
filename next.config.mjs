/** @type {import('next').NextConfig} */
const nextConfig = {
  // <CHANGE> Added cacheComponents support for Tailwind CSS v4
  cacheComponents: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
