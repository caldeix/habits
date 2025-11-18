/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  distDir: 'dist',
  output: 'export',
  basePath: isProd ? '/habits' : '',
  assetPrefix: isProd ? '/habits/' : '',  
}

export default nextConfig
