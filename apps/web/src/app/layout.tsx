import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { PointerProvider } from '@/components/providers/PointerProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zumi.studio'),
  title: {
    default: 'ZUMI — Technology & AI Transformation Studio',
    template: '%s · ZUMI',
  },
  description:
    'ZUMI builds AI agents, custom software, and enterprise platforms for companies shaping the future of business operations.',
  keywords: [
    'AI agents',
    'AI automation',
    'custom software',
    'healthcare HMS',
    'enterprise dashboards',
    'digital transformation',
  ],
  openGraph: {
    title: 'ZUMI — Technology & AI Transformation Studio',
    description:
      'We design and engineer AI systems and enterprise software for the future of business operations.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <PointerProvider />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
