import { defineBackground } from '#imports'
import { Content, ContentProtocolMap } from '@/utils/messaging'
import initDeviceIdBackground from './get-device-id'

export default defineBackground(() => {
  initDeviceIdBackground()

  // Allow accessing storage from content scripts
  chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })

  // Custom Event cant receive response if there are many content scripts,
  // so this is necessary, unfortunately. Can't even use Window messaging
  const sendMessage = (target: keyof ContentProtocolMap) =>
    async ({ data }: { data: any }) => {
      const [tab] = await chrome.tabs.query({
        active: true,
        windowType: 'normal',
        url: 'https://open.spotify.com/*'
      })

      console.debug(target, data)

      if (!tab || !tab.id) return false

      return Content.sendMessage(target, data, { tabId: tab.id })
    }

  // Peak duplicate lines solving
  const types: Array<keyof ContentProtocolMap> = [
    'add', 'play', 'toast', 'destroyToast',
  ]

  types.forEach(type => Content.onMessage(type, sendMessage(type)))
})
