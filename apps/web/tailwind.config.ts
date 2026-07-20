import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // ZUMI core palette — LIGHT editorial (white · gray · black)
        background: '#F1F0EC',
        surface: '#FFFFFF',
        'surface-2': '#E8E7E1',
        line: 'rgba(0,0,0,0.10)',
        ink: '#0B0B0B',
        text: {
          primary: '#0B0B0B',
          secondary: '#6C6C66',
        },
        accent: {
          DEFAULT: '#3B40FF',
          soft: '#6B74FF',
          deep: '#1F23C4',
        },
      },
      fontFamily: {
        // General Sans / Satoshi loaded via @font-face; Inter via next/font fallback chain
        sans: ['var(--font-inter)', 'General Sans', 'Satoshi', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'General Sans', 'var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter: '-0.03em',
      },
      maxWidth: {
        shell: '1320px',
      },
      spacing: {
        section: 'clamp(6rem, 14vh, 12rem)',
      },
      transitionTimingFunction: {
        // ZUMI motion system easings
        zumi: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'zumi-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
