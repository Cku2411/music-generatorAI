import { create } from "zustand";

interface PlayerTrack {
  id: string;
  title: string | null;
  artwork: string | null;
  prompt: string | null;
  createdByUsername: string | null;
  url?: string | null;
}

interface PlayerState {
  track: PlayerTrack | null;
  setTrack: (track: PlayerTrack) => void;
}

export const userPlayerStore = create<PlayerState>((set) => ({
  track: null,
  setTrack: (track) => set({ track }),
}));
