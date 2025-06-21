import { sendMessage, onMessage, ContentProtocolMap } from '@/utils/messaging'

export const getActiveTabId = async (sender: chrome.runtime.MessageSender) => {
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
export const sendResponse = (target: keyof ContentProtocolMap) =>
  async ({ data, sender }: { data: any, sender: chrome.runtime.MessageSender }) => {
    const tabId = await getActiveTabId(sender)
    console.debug(target, data, tabId)
    if (!tabId) return false
    return sendMessage(target, data, { tabId })
  }

export default async function initMessagesBackground() {
  // Peak duplicate lines solving
  const types: Array<keyof ContentProtocolMap> = [
    'play', 'join', 'toast', 'destroyToast',
  ]

  types.forEach(type => onMessage(type, sendResponse(type)))
}
