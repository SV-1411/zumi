'use client';

import { VideoCarousel } from '@/framer/Client';
import { InViewMount } from '@/components/fx/InViewMount';

// tiny inline dark poster so nothing flashes before the clip decodes
const DARK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='10'%3E%3Crect width='16' height='10' fill='%23060606'/%3E%3C/svg%3E";

const ITEMS = [
  { sourceType: 'url', url: '/media/studio.mp4', upload: '', poster: { src: DARK, alt: '' } },
  { sourceType: 'url', url: '/media/creative.mp4', upload: '', poster: { src: DARK, alt: '' } },
  { sourceType: 'url', url: '/media/fashion.mp4', upload: '', poster: { src: DARK, alt: '' } },
  { sourceType: 'url', url: '/media/city.mp4', upload: '', poster: { src: DARK, alt: '' } },
];

/**
 * VideoReel — an atmospheric "the craft, in motion" interlude built on the
 * vendored Framer VideoCarousel. Mounts only while on screen (InViewMount) so
 * the video decoders never run in the background.
 */
export function VideoReel() {
  return (
    <section id="reel" className="relative py-section">
      <div className="shell">
        <p className="mb-6 text-center text-[11px] uppercase tracking-[0.5em] text-text-secondary">
          The craft, in motion
        </p>
        <InViewMount
          className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-black/10"
          margin="200px"
        >
          <VideoCarousel items={ITEMS} />
        </InViewMount>
      </div>
    </section>
  );
}
