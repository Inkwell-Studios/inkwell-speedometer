import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

// Define the state structure and actions
export const useNuiState = create((set, get) => ({
  // Initial state
  visible: false,
  uiReady: false,
  lastMessage: null,

  // Action to set visibility
  setVisible: (visible) => {
    set({ visible })
  },

  // Action to mark UI as ready
  setUiReady: (ready) => {
    set({ uiReady: ready })
  },

  // Action to handle incoming NUI messages
  handleNuiMessage: (event) => {
    const { type, data } = event.data
    set({ lastMessage: { type, data } }) // Store last message for debugging

    switch (type) {
      case 'setVisible':
        // Only allow game to control visibility if not in dev mode
        // In dev mode, the DevTools component will control visibility directly
        if (!import.meta.env.DEV) {
          get().setVisible(data)
        } else {
          console.log('[NUI Store] Ignoring setVisible in DEV mode (use DevTools)')
        }
        break
      // Add more message type handlers here as needed
      default:
        console.warn(`[NUI Store] Unhandled message type: ${type}`)
        break
    }
  },
}))

// Hook to select specific state properties with shallow comparison
export const useNuiSelector = (selector) => {
  return useNuiState(selector, shallow)
} 