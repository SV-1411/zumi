'use client';

import { create } from 'zustand';

export type Intent =
  | 'saas'
  | 'automate'
  | 'ai'
  | 'scale'
  | 'healthcare'
  | null;

interface ExperienceState {
  /** Loader finished -> reveal the world. */
  loaded: boolean;
  setLoaded: (v: boolean) => void;

  /** Chosen narrative intent from the hero. Drives accent tinting & copy. */
  intent: Intent;
  setIntent: (i: Intent) => void;

  /** Floating AI assistant open state. */
  assistantOpen: boolean;
  toggleAssistant: (v?: boolean) => void;

  /** Normalised pointer (-1..1) shared with the 3D scenes. */
  pointer: { x: number; y: number };
  setPointer: (x: number, y: number) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  loaded: false,
  setLoaded: (v) => set({ loaded: v }),

  intent: null,
  setIntent: (i) => set({ intent: i }),

  assistantOpen: false,
  toggleAssistant: (v) =>
    set((s) => ({ assistantOpen: v ?? !s.assistantOpen })),

  pointer: { x: 0, y: 0 },
  setPointer: (x, y) => set({ pointer: { x, y } }),
}));
