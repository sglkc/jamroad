import { defineBackground } from '#imports'
import initDeviceIdBackground from './get-device-id'
import initMessagesBackground from './messages'
import initPeersBackground from './peers'
import initPlaylistBackground from './playlist'

export default defineBackground(() => {
  initDeviceIdBackground()
  initMessagesBackground()
  initPlaylistBackground()
  initPeersBackground()

  // Allow accessing storage from content scripts
  chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' })
})
