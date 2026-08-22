// Archivo: next.config.mjs
// v11.95-GOLD — Sovereign config with conditional dev export & trailing slash protection
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evitar problemas de chunks y enrutamiento en desarrollo local desactivando 'export' en dev
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
