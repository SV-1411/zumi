'use client';

import { create } from 'zustand';

/**
 * The companion's emotional/behavioural state. BOTH the chat logic and the 3D
 * astronaut read this single store, so the model's pose always mirrors what the
 * AI is doing — e.g. it visibly "thinks" while the AI is computing a reply.
 */
export type CompanionState =
  | 'idle'
  | 'listening' // visitor is typing
  | 'thinking' // AI is computing
  | 'speaking' // delivering a reply
  | 'happy'
  | 'confused'
  | 'celebrate'; // gave a recommendation / finalised

interface CompanionStore {
  state: CompanionState;
  setState: (s: CompanionState) => void;
}

export const useCompanion = create<CompanionStore>((set) => ({
  state: 'idle',
  setState: (s) => set({ state: s }),
}));

/** Per-state visual config consumed by the astronaut + visor. */
export const STATE_CONFIG: Record<
  CompanionState,
  { color: string; bobSpeed: number; bobAmp: number; tilt: number }
> = {
  idle: { color: '#4F6FFF', bobSpeed: 1.0, bobAmp: 0.06, tilt: 0 },
  listening: { color: '#7C92FF', bobSpeed: 1.6, bobAmp: 0.05, tilt: 0.08 },
  thinking: { color: '#E5A24B', bobSpeed: 0.6, bobAmp: 0.03, tilt: 0.22 },
  speaking: { color: '#4F6FFF', bobSpeed: 1.3, bobAmp: 0.07, tilt: -0.04 },
  happy: { color: '#3FC489', bobSpeed: 1.8, bobAmp: 0.1, tilt: -0.06 },
  confused: { color: '#E07B53', bobSpeed: 0.9, bobAmp: 0.05, tilt: 0.05 },
  celebrate: { color: '#3FC489', bobSpeed: 2.4, bobAmp: 0.16, tilt: -0.1 },
};
