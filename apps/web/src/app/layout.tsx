import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { PointerProvider } from '@/components/providers/PointerProvider';
import { Cursor } from '@/components/providers/Cursor';
import { ScrollProgress } from '@/components/providers/ScrollProgress';
import { CinemaOverlay } from '@/components/providers/CinemaOverlay';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zumi.studio'),
  title: {
    default: 'ZUMI — A Multidisciplinary Studio',
    template: '%s · ZUMI',
  },
  description:
    'ZUMI is a multidisciplinary studio — design, video, web, automation and AI, made in one room and shipped live.',
  keywords: [
    'ZUMI',
    'design studio',
    'video editing',
    'web development',
    'automation',
    'AI agency',
    'branding',
    'creative studio',
  ],
  openGraph: {
    title: 'ZUMI — A Multidisciplinary Studio',
    description:
      'Design, video, web, automation and AI — one studio, shipped live.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#F1F0EC',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background text-text-primary antialiased"
        suppressHydrationWarning
      >
        <PointerProvider />
        <ScrollProgress />
        <Cursor />
        <CinemaOverlay />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
