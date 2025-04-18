import { create } from 'zustand'

// Store to manage timestamps for rate-limited actions
export const useRateLimitStore = create((set, get) => ({
  actionTimestamps: {},

  // Sets the last execution time for a specific action ID
  setLastActionTime: (id, time) => set((state) => ({
    actionTimestamps: {
      ...state.actionTimestamps,
      [id]: time,
    },
  })),

  // Gets the last execution time for a specific action ID
  getLastActionTime: (id) => get().actionTimestamps[id] || 0,
})) 