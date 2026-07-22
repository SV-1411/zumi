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
  metadataBase: new URL('https://shivanshverma.dev'),
  title: {
    default: 'Shivansh Verma — Full-stack & AI Engineer',
    template: '%s · Shivansh Verma',
  },
  description:
    'I build AI products that ship, from AI agents and SaaS to games, robotics and fintech. A few of them, running live.',
  keywords: [
    'Shivansh Verma',
    'full-stack engineer',
    'AI engineer',
    'AI agents',
    'Next.js',
    'game developer',
    'robotics',
    'portfolio',
  ],
  openGraph: {
    title: 'Shivansh Verma — Full-stack & AI Engineer',
    description:
      'AI products that ship, agents, SaaS, games, robotics, fintech. Running live.',
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
