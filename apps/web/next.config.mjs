/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @zumi/db is a TS workspace package -> must be transpiled.
  transpilePackages: ['three', '@zumi/db'],
  // Keep Prisma + Neon driver external (don't bundle into serverless functions).
  serverExternalPackages: [
    '@prisma/client',
    '.prisma/client',
    '@prisma/adapter-neon',
    '@neondatabase/serverless',
    'ws',
  ],
  experimental: {
    optimizePackageImports: ['three', '@react-three/drei', 'framer-motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
