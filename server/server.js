// Example of receiving data from client
onNet('inkwell-react-template:buttonClicked', (message) => {
  const source = global.source
  console.log(`Player ${source} clicked button with message: ${message}`)
 
  // Example of sending data back to client
  emitNet('inkwell-react-template:updateFromServer', source, {
    receivedAt: new Date().toISOString()
  })
})

// Rate limit storage - tracks cooldowns per user
const rateLimits = new Map()

// Helper to clean up expired rate limits
const cleanupRateLimits = () => {
  const now = Date.now()
  for (const [userId, limits] of rateLimits.entries()) {
    for (const [actionId, timestamp] of Object.entries(limits)) {
      if (now - timestamp.lastAction >= timestamp.cooldown) {
        delete limits[actionId]
      }
    }
    if (Object.keys(limits).length === 0) {
      rateLimits.delete(userId)
    }
  }
}

// Run cleanup every minute
setInterval(cleanupRateLimits, 60000)

// Check if an action is rate limited
const isRateLimited = (userId, actionId) => {
  const userLimits = rateLimits.get(userId)
  if (!userLimits || !userLimits[actionId]) return false

  const { lastAction, cooldown } = userLimits[actionId]
  const now = Date.now()
  return now - lastAction < cooldown
}

// Set rate limit for a user's action
const setRateLimit = (userId, actionId, cooldown) => {
  if (!rateLimits.has(userId)) {
    rateLimits.set(userId, {})
  }
  
  const userLimits = rateLimits.get(userId)
  userLimits[actionId] = {
    lastAction: Date.now(),
    cooldown
  }
}

// Handle rate limit check requests from clients
onNet('inkwell-react-template:checkRateLimit', (actionId, cooldown) => {
  const src = source
  const userId = GetPlayerIdentifiers(src)[0] // Get player's identifier

  if (isRateLimited(userId, actionId)) {
    emitNet('inkwell-react-template:rateLimitResponse', src, actionId, false)
    return
  }

  setRateLimit(userId, actionId, cooldown)
  emitNet('inkwell-react-template:rateLimitResponse', src, actionId, true)
}) 