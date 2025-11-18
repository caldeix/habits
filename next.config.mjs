/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  distDir: 'dist',
  server: {
    host: '0.0.0.0',
    port: 3000
  }
}

export default nextConfig
