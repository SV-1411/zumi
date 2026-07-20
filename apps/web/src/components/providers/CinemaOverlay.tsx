'use client';

/**
 * CinemaOverlay — a whisper of film grain over the light editorial theme.
 * Non-interactive. Keeps the paper feeling tactile without darkening anything.
 */
export function CinemaOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden>
      <div className="cinema-grain absolute inset-0" />
    </div>
  );
}
