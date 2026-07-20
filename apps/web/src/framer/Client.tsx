'use client';

/**
 * Client-only wrappers around the vendored Framer community components.
 * They touch the DOM (canvas / video / window) and use Math.random for ids,
 * so they must never SSR — hence dynamic(..., { ssr: false }).
 *
 * The `framer` imports inside these modules resolve to unframer's runtime via
 * the webpack alias in next.config.mjs. next/dynamic requires the options arg
 * to be an inline object literal (SWC client-reference transform).
 */
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

export const TextVideoMask = dynamic(() => import('./TextVideoMask.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const LogoPreloader = dynamic(() => import('./LogoPreloader.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const ParticleText = dynamic(() => import('./ParticleText.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const LiquidImage = dynamic(() => import('./LiquidImage.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const FluidImage = dynamic(() => import('./FluidImage.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const VideoCarousel = dynamic(() => import('./VideoCarousel.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const TextReveal = dynamic(() => import('./TextReveal.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const EyeFollowButton = dynamic(() => import('./EyeFollowButton.js'), {
  ssr: false,
}) as ComponentType<AnyProps>;
