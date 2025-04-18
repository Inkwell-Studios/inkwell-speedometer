import { useState, useCallback, useEffect } from 'react'
import { useNui } from '../providers/NuiProvider'
import { useRateLimitStore } from '../stores/rateLimitStore'

/**
 * Custom hook to manage rate limiting for actions with server-side validation.
 * @param {string} id - A unique identifier for the action being rate-limited.
 * @param {number} cooldown - The cooldown period in milliseconds.
 * @returns {{ isRateLimited: boolean, performAction: (actionFn: () => void) => void }}
 */
export function useRateLimit(id, cooldown) {
  const { sendMessage } = useNui()
  const [isRateLimited, setIsRateLimited] = useState(false)
  const { getLastActionTime, setLastActionTime } = useRateLimitStore()

  // Effect to handle rate limit responses from the server
  useEffect(() => {
    const handleRateLimitResponse = (event) => {
      const { type, data } = JSON.parse(event.data)
      if (type === 'rateLimitResponse' && data.actionId === id) {
        setIsRateLimited(!data.allowed)
        if (data.allowed) {
          setLastActionTime(id, Date.now())
        }
      }
    }

    window.addEventListener('message', handleRateLimitResponse)
    return () => window.removeEventListener('message', handleRateLimitResponse)
  }, [id, setLastActionTime])

  // Function to attempt performing an action, checking with server first
  const performAction = useCallback(async (actionFn) => {
    // Check local cooldown first to avoid unnecessary server calls
    const lastActionTime = getLastActionTime(id)
    const now = Date.now()
    
    if (now - lastActionTime < cooldown) {
      console.warn(`Action [${id}] is rate limited. Please wait.`)
      return
    }

    // Request server validation
    await sendMessage('checkRateLimit', { actionId: id, cooldown })
    
    // The action will be executed only if the server responds with allowed=true
    // This is handled in the effect above
  }, [id, cooldown, sendMessage, getLastActionTime])

  return { isRateLimited, performAction }
} 