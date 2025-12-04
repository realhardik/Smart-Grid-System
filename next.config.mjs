/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable static export for Capacitor/Android
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
  }),
}

export default nextConfig
