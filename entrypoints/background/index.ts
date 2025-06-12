import { defineBackground } from '#imports'
import initDeviceIdBackground from './get-device-id'
import initMessagesBackground from './messages'

export default defineBackground(() => {
  initDeviceIdBackground()
  initMessagesBackground()

  // Allow accessing storage from content scripts
  chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })
})
