import { onMessage } from '@/utils/messaging'
import { peersStorage } from '@/utils/storage'

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

  onMessage('removePeer', async ({ data }) => {
    const index = peers.findIndex((username) => username === data)
    if (index === -1) return false

    peers.splice(index, 1)
    await peersStorage.setValue(peers)

    return true
  })
}
