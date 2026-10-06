import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface PinState {
  pinnedIds: string[];
  togglePin: (id: string) => void;
  isPinned: (id: string) => boolean;
  clearAllPins: () => void;
}

export const usePinStore = create<PinState>()(
  persist(
    (set, get) => ({
      pinnedIds: [],
      togglePin: (id: string) => {
        set((state) => {
          const isCurrentlyPinned = state.pinnedIds.includes(id);
          const nextPinnedIds = isCurrentlyPinned
            ? state.pinnedIds.filter((pinnedId) => pinnedId !== id)
            : [...state.pinnedIds, id];
          return { pinnedIds: nextPinnedIds };
        });
      },
      isPinned: (id: string) => {
        return get().pinnedIds.includes(id);
      },
      clearAllPins: () => {
        set({ pinnedIds: [] });
      },
    }),
    {
      name: 'student_deadline_pinned_ids',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
