'use client';

/**
 * Client-only loaders for the vendored React Bits (react-bits.dev) WebGL
 * backgrounds. Both touch WebGL/canvas + window, so they never SSR.
 */
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

export const Aurora = dynamic(() => import('./Aurora.jsx'), {
  ssr: false,
}) as ComponentType<AnyProps>;

export const Silk = dynamic(() => import('./Silk.jsx'), {
  ssr: false,
}) as ComponentType<AnyProps>;
