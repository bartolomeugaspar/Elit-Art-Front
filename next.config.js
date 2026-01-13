/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 detecta automaticamente a pasta src
  images: {
    unoptimized: true,
    domains: ['ahmsdxdqlqptppsyeohr.supabase.co']
  },
  reactStrictMode: true,
  swcMinify: true,
  // Configurações de produção
  compress: true,
  poweredByHeader: false,
  generateEtags: true
}

module.exports = nextConfig
