import { defineBackground } from '#imports'
import { deviceIdStorage } from '@/utils/storage'

export default defineBackground(() => {
  console.log('Hello background!', { id: chrome.runtime.id })

  function getDeviceId(
    event: chrome.webRequest.WebRequestBodyDetails
  ): void | chrome.webRequest.BlockingResponse {
    /**
     * https://gew4-spclient.spotify.com/track-playback/v1/devices/(device_id)/volume
     * https://gew4-spclient.spotify.com/track-playback/v1/devices/(device_id)/state
     */
    if (event.url.includes('/devices/')) {
      const [_, deviceId] = event.url.match(/\/devices\/(.+)\//) ?? []

      if (deviceId) {
        deviceIdStorage.setValue(deviceId)
        return
      }
    }

    // https://gew4-spclient.spotify.com/track-playback/v1/devices
    if (event.url.endsWith('/devices')) {
      if (!event.requestBody?.raw) return

      const rawData = event.requestBody.raw
      try {
        if (rawData && rawData.length > 0) {
          // Handle multiple raw data chunks if needed
          let fullString = ''

          for (let i = 0; i < rawData.length; i++) {
            const uint8 = new Uint8Array(rawData[i].bytes ?? new ArrayBuffer())
            const numbers = Array.from(uint8)
            const chunk = decodeURIComponent(String.fromCharCode.apply(null, numbers))
            fullString += chunk
          }

          // deviceId in { device: { device_id: 'here' } }
          const json = JSON.parse(fullString)
          const deviceId = json?.device?.device_id

          if (deviceId) deviceIdStorage.setValue(deviceId)
        }
      } catch (error) {
        console.error('Error parsing request body:', error)
      }
    }
  }

  // Get device ID from API requests
  chrome.webRequest.onBeforeRequest.addListener(
    getDeviceId,
    { urls: ['https://*.spotify.com/track-playback/v1/*'] },
    ['requestBody']
  )

  deviceIdStorage.watch((deviceId) => {
    console.log('Got device id:', deviceId)
  })
})
