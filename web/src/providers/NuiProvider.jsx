import { createContext, useContext, useCallback, useEffect } from 'react'
import { useNuiState, useNuiSelector } from '../stores/nui'

const NuiContext = createContext(null)

export const useNui = () => {
  const context = useContext(NuiContext)
  if (!context) throw new Error('useNui must be used within NuiProvider')
  return context
}

export function NuiProvider({ children }) {
  const setVisible = useNuiState((state) => state.setVisible)
  const setUiReady = useNuiState((state) => state.setUiReady)
  const handleNuiMessage = useNuiState((state) => state.handleNuiMessage)
  const visible = useNuiSelector((state) => state.visible) // Use selector for efficient updates

  // Function to send messages to the game client
  const sendMessage = useCallback(async (event, data = {}) => {
    const eventName = typeof event === 'string' ? event : 'unknownEvent'
    try {
      const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : 'inkwell-react-template' // Fallback name
      const resp = await fetch(`https://${resourceName}/${eventName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
      })

      if (!resp.ok) {
        console.error(`[NUI Provider] Failed to send ${eventName}: ${resp.status}`)
        return null // Or throw an error
      }
      // Attempt to parse JSON, but return raw text if it fails
      try {
        return await resp.json()
      } catch (e) {
        return await resp.text() // Return text if not valid JSON
      }
    } catch (err) {
      console.error(`[NUI Provider] Error sending ${eventName}:`, err)
      return null // Or throw an error
    }
  }, [])

  // Function to hide the NUI frame (requests client to hide)
  const hideFrame = useCallback(() => {
    // If in dev mode, just hide locally without telling the client
    if (import.meta.env.DEV) {
      setVisible(false)
    } else {
      sendMessage('hideFrame')
      // Visibility state will be updated via 'setVisible' message from client
    }
  }, [sendMessage, setVisible])

  // Effect to handle NUI messages from the game client
  useEffect(() => {
    const messageHandler = (event) => {
        handleNuiMessage(event);
    };
    window.addEventListener('message', messageHandler);

    // Notify client that UI is ready
    sendMessage('uiReady');
    setUiReady(true); // Mark UI as ready in the store

    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [sendMessage, handleNuiMessage, setUiReady]);

  // Effect to handle ESC key press for hiding the frame
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        hideFrame()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hideFrame])

  const value = {
    visible,
    setVisible, // Expose setVisible for DevTools
    sendMessage,
    hideFrame,
    handleNuiMessage
  }

  return (
    <NuiContext.Provider value={value}>
      {children}
    </NuiContext.Provider>
  )
} 