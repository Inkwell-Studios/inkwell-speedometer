let nuiReady = false

// Handle NUI Ready event
RegisterNuiCallback('uiReady', (data, cb) => {
  nuiReady = true
  // Initially hide the UI
  SendNuiMessage(JSON.stringify({
    type: 'setVisible',
    data: false
  }))
  cb({})
})

// Handle button click from NUI
RegisterNuiCallback('buttonClicked', (data, cb) => {
  emitNet('inkwell-react-template:buttonClicked', data.message)
  cb({})
})

// Handle hide frame request from NUI
RegisterNuiCallback('hideFrame', (_, cb) => {
  SetNuiFocus(false, false)
  // Also tell the UI its visibility state changed
  SendNuiMessage(JSON.stringify({
    type: 'setVisible',
    data: false
  }))
  cb({})
})

// Handle DevTools test message
RegisterNuiCallback('devTestMessage', (data, cb) => {
  cb({ received: true, timestamp: data.timestamp })
})

// Example command to toggle UI
RegisterCommand('toggleui', () => {
  if (!nuiReady) {
    return
  }
  SetNuiFocus(true, true)
  SendNuiMessage(JSON.stringify({
    type: 'setVisible',
    data: true
  }))
}, false)

// Example command to hide UI
RegisterCommand('hideui', () => {
  SetNuiFocus(false, false)
  SendNuiMessage(JSON.stringify({
    type: 'setVisible',
    data: false
  }))
}, false)

// Example of receiving data from server
onNet('inkwell-react-template:updateFromServer', (data) => {
  if (!nuiReady) {
    return
  }

  SendNuiMessage(JSON.stringify({
    type: 'updateFromServer',
    data
  }))
})

// Handle rate limit responses from server
onNet('inkwell-react-template:rateLimitResponse', (actionId, allowed) => {
  SendNuiMessage(JSON.stringify({
    type: 'rateLimitResponse',
    data: { actionId, allowed }
  }))
})

// Handle rate limit check requests from NUI
RegisterNuiCallback('checkRateLimit', (data, cb) => {
  const { actionId, cooldown } = data
  emitNet('inkwell-react-template:checkRateLimit', actionId, cooldown)
  cb({})
}) 