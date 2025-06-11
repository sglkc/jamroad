import { defineBackground } from '#imports'
import { Content } from '@/utils/messaging'
import initDeviceIdBackground from './get-device-id'

export default defineBackground(() => {
  initDeviceIdBackground()

  // Custom Event cant receive response if there are many content scripts,
  // so this is necessary, unfortunately. Can't even use Window messaging
  const sendMessage = (target: any) =>
    async ({ data }: { data: any }) => {
      const [tab] = await chrome.tabs.query({
        active: true,
        windowType: 'normal',
        url: 'https://open.spotify.com/*'
      })

      if (!tab || !tab.id) return false

      return Content.sendMessage(target, data, { tabId: tab.id })
    }

  Content.onMessage('add', sendMessage('add'))
  Content.onMessage('play', sendMessage('play'))
  Content.onMessage('toast', sendMessage('toast'))
  Content.onMessage('destroyToast', sendMessage('destroyToast'))
})
