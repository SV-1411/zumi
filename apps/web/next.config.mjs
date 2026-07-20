import { createRequire } from 'module';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
// Resolve unframer's Framer runtime shim (implements addPropertyControls,
// ControlType, withCSS, useVariantState, addFonts, … 700+ names) so the
// vendored Framer community components in src/framer/* — which `import … from
// "framer"` — resolve against a real runtime instead of the missing package.
const unframerDir = dirname(require.resolve('unframer/package.json'));
const framerRuntime = join(unframerDir, 'dist', 'framer.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @zumi/db is a TS workspace package -> must be transpiled.
  transpilePackages: ['three', '@zumi/db', 'unframer'],
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
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      framer: framerRuntime,
    };
    return config;
  },
};

export default nextConfig;
