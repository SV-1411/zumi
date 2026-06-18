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
        // ZUMI core palette — elegant, sophisticated, premium (not neon)
        background: '#0B0B0B',
        surface: '#151515',
        'surface-2': '#1C1C1C',
        line: 'rgba(255,255,255,0.08)',
        text: {
          primary: '#F7F7F7',
          secondary: '#A0A0A0',
        },
        accent: {
          DEFAULT: '#4F6FFF',
          soft: '#DDE4FF',
          deep: '#2C3FB0',
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
