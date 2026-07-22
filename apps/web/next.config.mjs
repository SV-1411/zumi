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
  transpilePackages: ['three', 'unframer'],
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
