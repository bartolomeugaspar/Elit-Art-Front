/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 detecta automaticamente a pasta src
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
