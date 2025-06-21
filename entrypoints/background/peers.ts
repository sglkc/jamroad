import { onMessage } from '@/utils/messaging'
import { peersStorage } from '@/utils/storage'
import { sendResponse } from './messages'

export default async function initPeersBackground() {
  let peers = await peersStorage.getValue()

  // Watch for external changes in the peers storage
  peersStorage.watch((newPeers) => {
    peers = newPeers
  })

  onMessage('addPeer', async ({ data }) => {
    await peersStorage.setValue([...peers, data])

    return true
  })

  onMessage('removePeer', async (message) => {
    const index = peers.findIndex((username) => username === message.data)
    if (index === -1) return false

    peers.splice(index, 1)
    await peersStorage.setValue(peers)

    // Forward to content script for peer disconnect
    return await sendResponse('removePeer')(message) as boolean
  })
}
