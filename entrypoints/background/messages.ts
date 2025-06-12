import { Content, ContentProtocolMap } from '@/utils/messaging'
import { playlistStorage } from '@/utils/storage'

export default async function initMessagesBackground() {
  const getActiveTabId = async (sender: chrome.runtime.MessageSender) => {
    if (sender.tab?.id) return sender.tab.id

    const [tab] = await chrome.tabs.query({
      active: true,
      windowType: 'normal',
      url: 'https://open.spotify.com/*'
    })

    return tab?.id
  }

  // Custom Event cant receive response if there are many content scripts,
  // so this is necessary, unfortunately. Can't even use Window messaging
  const sendMessage = (target: keyof ContentProtocolMap) =>
    async ({ data, sender }: { data: any, sender: chrome.runtime.MessageSender }) => {
      const tabId = await getActiveTabId(sender)
      console.debug(target, data, tabId)
      if (!tabId) return false
      return Content.sendMessage(target, data, { tabId })
    }

  // Peak duplicate lines solving
  const types: Array<keyof ContentProtocolMap> = [
    'play', 'toast', 'destroyToast',
  ]

  types.forEach(type => Content.onMessage(type, sendMessage(type)))

  // Unique event
  const playlist = await playlistStorage.getValue()
  Content.onMessage('add', async ({ data, sender }) => {
    playlist.push(data)
    playlistStorage.setValue(playlist)
    return Content.sendMessage('add', data, await getActiveTabId(sender))
  })
}
