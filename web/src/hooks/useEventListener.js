import { useEffect, useRef } from 'react'

/**
 * Custom hook for handling event listeners
 * @param {string} eventName - The name of the event to listen for
 * @param {Function} handler - The callback function to handle the event
 * @param {Element | Window | Document | null} element - The element to attach the listener to (defaults to window)
 * @param {boolean} [passive=false] - Whether the event listener should be passive
 */
export const useEventListener = (eventName, handler, element = window, passive = false) => {
  // Create a ref that stores handler
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Define the listening target
    const targetElement = element?.current ?? element

    if (!targetElement?.addEventListener) return

    // Create event listener that calls handler function stored in ref
    const eventListener = (event) => savedHandler.current(event)

    // Add event listener
    const options = passive ? { passive } : undefined
    targetElement.addEventListener(eventName, eventListener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element, passive])
}

/**
 * Custom hook for handling multiple event listeners
 * @param {Array<{ name: string, handler: Function }>} events - Array of event objects
 * @param {Element | Window | Document | null} element - The element to attach the listeners to
 * @param {boolean} [passive=false] - Whether the event listeners should be passive
 */
export const useEventListeners = (events, element = window, passive = false) => {
  useEffect(() => {
    const targetElement = element?.current ?? element
    if (!targetElement?.addEventListener) return

    // Add all event listeners
    const listeners = events.map(({ name, handler }) => {
      const eventListener = (event) => handler(event)
      const options = passive ? { passive } : undefined
      targetElement.addEventListener(name, eventListener, options)
      return { name, eventListener }
    })

    // Remove all event listeners on cleanup
    return () => {
      listeners.forEach(({ name, eventListener }) => {
        targetElement.removeEventListener(name, eventListener)
      })
    }
  }, [events, element, passive])
} 